import { Status, AuthToken } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class StatusService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem?.dto ?? null
    };
    return this.serverFacade.getMoreFeedItems(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem?.dto ?? null
    };
    return this.serverFacade.getMoreStoryItems(request);
  }
}
