import { UserDto, StatusDto, AuthTokenDto, AuthToken, Status } from "tweeter-shared";
import { DAOFactory } from "../factory/DAOFactory";
import { UserDAO } from "../dao/UserDAO";
import { ProfileImageDAO } from "../dao/ProfileImageDAO";
import bcrypt from "bcryptjs";
import { AuthService } from "./AuthService";
import { FeedDAO } from "../dao/FeedDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { FollowDAO } from "../dao/FollowDAO";

export class UserService extends AuthService {
  private userDAO: UserDAO;
  private profileImageDAO: ProfileImageDAO;
  private feedDAO: FeedDAO;
  private storyDAO: StoryDAO;
  private followDAO: FollowDAO;

  constructor() {
    super();
    const daoFactory = DAOFactory.getInstance();
    this.userDAO = daoFactory.createUserDAO();
    this.profileImageDAO = daoFactory.createProfileImageDAO();
    this.feedDAO = daoFactory.createFeedDAO();
    this.storyDAO = daoFactory.createStoryDAO();
    this.followDAO = daoFactory.createFollowDAO();
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

    const currentUserAlias = await this.authDAO.getAuthTokenAlias(token);
    const followerAliases = await this.followDAO.getAllFollowerAliases(currentUserAlias);

    const status = Status.fromDto(newStatus);
    if (status === null) {
      throw new Error("Invalid status");
    }

    await this.storyDAO.putStatus(status);
    await this.feedDAO.putStatus(followerAliases, status);
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
