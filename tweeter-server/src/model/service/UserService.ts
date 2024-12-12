import { UserDto, StatusDto, AuthTokenDto, AuthToken, Status } from "tweeter-shared";
import { DAOFactory } from "../factory/DAOFactory";
import { UserDAO } from "../dao/UserDAO";
import { ProfileImageDAO } from "../dao/ProfileImageDAO";
import bcrypt from "bcryptjs";
import { AuthService } from "./AuthService";
import { FeedDAO } from "../dao/FeedDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { DeleteMessageCommand, SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class UserService extends AuthService {
  private userDAO: UserDAO;
  private profileImageDAO: ProfileImageDAO;
  private feedDAO: FeedDAO;
  private storyDAO: StoryDAO;
  private followDAO: FollowDAO;
  private sqsClient: SQSClient;

  constructor() {
    super();
    const daoFactory = DAOFactory.getInstance();
    this.userDAO = daoFactory.createUserDAO();
    this.profileImageDAO = daoFactory.createProfileImageDAO();
    this.feedDAO = daoFactory.createFeedDAO();
    this.storyDAO = daoFactory.createStoryDAO();
    this.followDAO = daoFactory.createFollowDAO();
    this.sqsClient = new SQSClient({ region: "us-east-1" });
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    this.validateToken(token);
    return this.userDAO.getUser(alias);
    // will need to post to feed as well
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const imageURL = await this.profileImageDAO.putImage(alias, imageStringBase64);
    const passwordHash = await this.hashPassword(password);
    const tweeterAlias = await this.tweeterHandle(alias);
    const user = await this.userDAO.putUser(
      firstName,
      lastName,
      tweeterAlias,
      passwordHash,
      imageURL
    );

    if (user === null) {
      throw new Error("Invalid registration");
    }

    const authToken = await this.authDAO.putAuthToken(AuthToken.Generate(), tweeterAlias);

    if (authToken === null) {
      throw new Error("Failed to generate auth token");
    }

    return [user, authToken];
  }

  public async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]> {
    const tweeterAlias = await this.tweeterHandle(alias);
    this.validateUser(tweeterAlias, password);

    const user = await this.userDAO.getUser(tweeterAlias);

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    const authToken = await this.authDAO.putAuthToken(AuthToken.Generate(), tweeterAlias);

    if (authToken === null) {
      throw new Error("Failed to generate auth token");
    }

    return [user, authToken];
  }

  public async logout(token: string): Promise<void> {
    await this.authDAO.deleteAuthToken(token);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    this.validateToken(token);

    const status = Status.fromDto(newStatus);
    if (status === null) {
      throw new Error("Invalid status");
    }

    await this.storyDAO.putStatus(status);

    const params = {
      MessageBody: JSON.stringify(newStatus),
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/867344436360/TweeterPostsQ"
    };

    try {
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
      throw err;
    }
  }

  public async fetchFollowers(body: StatusDto) {
    const followerAliases = await this.followDAO.getAllFollowerAliases(body.user.alias);
    const jobs = this.chunkArray(followerAliases, 25);

    let jobCounter = 0;

    for (const job of jobs) {
      const params = {
        MessageBody: JSON.stringify({ status: { ...body }, followers: job }),
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/867344436360/TweeterJobsQ"
      };

      console.log("Sending job", ++jobCounter, "out of", jobs.length);

      try {
        const data = await this.sqsClient.send(new SendMessageCommand(params));
        console.log("Success, job sent. MessageID:", data.MessageId);
      } catch (err) {
        throw err;
      }
    }
  }

  public async jobHandler(body: { status: StatusDto; followers: string[] }) {
    const statusClass = Status.fromDto(body.status);
    if (statusClass === null) {
      throw new Error("Invalid status");
    }
    // console.log("Processing job for status:", statusClass);
    try {
      await this.feedDAO.putStatus(body.followers, statusClass);
      // console.log("Success, job posted.");
    } catch (err) {
      throw err;
    }
  }

  private chunkArray(array: string[], chunkSize: number): string[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(5);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }

  private async validateUser(alias: string, password: string): Promise<void> {
    const userPasswordHash = await this.userDAO.getUserPasswordHash(alias);

    if (userPasswordHash === null) {
      throw new Error("Invalid alias");
    }

    const isValid = await bcrypt.compare(password, userPasswordHash);

    if (!isValid) {
      throw new Error("Invalid password");
    }
  }
}
