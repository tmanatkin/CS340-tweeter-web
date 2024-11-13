import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem?.dto ?? null
    };
    return this.serverFacade.getMoreFollowees(request);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem?.dto ?? null
    };
    return this.serverFacade.getMoreFollowees(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request = {
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto
    };
    return this.serverFacade.getIsFollowerStatus(request);
  }

  public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    const request = {
      token: authToken.token,
      user: user.dto
    };
    return this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    const request = {
      token: authToken.token,
      user: user.dto
    };
    return this.serverFacade.getFollowerCount(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // await new Promise((f) => setTimeout(f, 2000));
    const request = {
      token: authToken.token,
      user: userToFollow.dto
    };
    return this.serverFacade.follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // await new Promise((f) => setTimeout(f, 2000));
    const request = {
      token: authToken.token,
      user: userToUnfollow.dto
    };
    return this.serverFacade.unfollow(request);
  }
}
