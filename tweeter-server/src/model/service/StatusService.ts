import { FakeData, Status, StatusDto } from "tweeter-shared";
import { FeedDAO } from "../dao/FeedDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { AuthService } from "./AuthService";
import { DAOFactory } from "../factory/DAOFactory";
import { UserDAO } from "../dao/UserDAO";

export class StatusService extends AuthService {
  private feedDAO: FeedDAO;
  private storyDAO: StoryDAO;
  private userDAO: UserDAO;

  constructor() {
    super();
    const daoFactory = DAOFactory.getInstance();
    this.feedDAO = daoFactory.createFeedDAO();
    this.storyDAO = daoFactory.createStoryDAO();
    this.userDAO = daoFactory.createUserDAO();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    this.validateToken(token);

    const dataPage = await this.feedDAO.getPageOfFeed(
      userAlias,
      pageSize,
      Status.fromDto(lastItem)
    );

    const statusDtos: StatusDto[] = [];
    for (const result of dataPage.values) {
      const user = await this.userDAO.getUser(result.alias);
      if (user) {
        statusDtos.push(new Status(result.post, user, result.timestamp).dto);
      }
    }
    return [statusDtos, dataPage.hasMorePages];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    this.validateToken(token);

    const dataPage = await this.storyDAO.getPageOfStory(
      userAlias,
      pageSize,
      Status.fromDto(lastItem)
    );

    const statusDtos: StatusDto[] = [];
    for (const result of dataPage.values) {
      const user = await this.userDAO.getUser(result.alias);
      if (user) {
        statusDtos.push(new Status(result.post, user, result.timestamp).dto);
      }
    }
    return [statusDtos, dataPage.hasMorePages];
  }
}
