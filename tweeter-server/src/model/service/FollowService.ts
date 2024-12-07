import { User, FakeData, UserDto, Follow } from "tweeter-shared";
import { AuthService } from "./AuthService";
import { DAOFactory } from "../factory/DAOFactory";
import { FollowDAO } from "../dao/FollowDAO";
import { UserDAO } from "../dao/UserDAO";

export class FollowService extends AuthService {
  private followDAO: FollowDAO;
  private userDAO: UserDAO;

  constructor() {
    super();
    const daoFactory = DAOFactory.getInstance();
    this.followDAO = daoFactory.createFollowDAO();
    this.userDAO = daoFactory.createUserDAO();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    this.validateToken(token);

    const user = await this.userDAO.getUser(userAlias);

    if (!user) {
      throw new Error("User not found");
    }

    const dataPage = await this.followDAO.getPageOfFollowers(
      user,
      pageSize,
      lastItem ? User.fromDto(lastItem) ?? undefined : undefined
    );
    // const userDtos = dataPage.values.map((follow) => follow.follower.dto);
    const userDtos: UserDto[] = [];
    for (const followerAlias of dataPage.values) {
      const followee = await this.userDAO.getUser(followerAlias);
      if (followee) {
        userDtos.push(followee.dto);
      }
    }
    return [userDtos, dataPage.hasMorePages];
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    this.validateToken(token);

    const user = await this.userDAO.getUser(userAlias);

    if (!user) {
      throw new Error("User not found");
    }

    const dataPage = await this.followDAO.getPageOfFollowees(
      user,
      pageSize,
      lastItem ? User.fromDto(lastItem) ?? undefined : undefined
    );

    // const userDtos = dataPage.values.map((follow) => follow.followee.dto);
    const userDtos: UserDto[] = [];
    for (const followeeAlias of dataPage.values) {
      const followee = await this.userDAO.getUser(followeeAlias);
      if (followee) {
        userDtos.push(followee.dto);
      }
    }
    return [userDtos, dataPage.hasMorePages];
  }

  // private async getFollowData(
  //   lastItem: UserDto | null,
  //   pageSize: number,
  //   userAlias: string
  // ): Promise<[UserDto[], boolean]> {
  //   const [items, hasMore] = FakeData.instance.getPageOfUsers(
  //     User.fromDto(lastItem),
  //     pageSize,
  //     userAlias
  //   );
  //   const dtos = items.map((user) => user.dto);
  //   return [dtos, hasMore];
  // }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    this.validateToken(token);
    const follow = await this.followDAO.getFollow(User.fromDto(user)!, User.fromDto(selectedUser)!);

    return !!follow;
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    this.validateToken(token);
    const followeeAliases = await this.followDAO.getAllFolloweeAliases(user.alias);
    const count = followeeAliases.length;
    return count;
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    this.validateToken(token);
    const followerAliases = await this.followDAO.getAllFollowerAliases(user.alias);
    const count = followerAliases.length;
    return count;
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    this.validateToken(token);
    const currentUserAlias = await this.getCurrentUserAlias(token);
    const currentUser = await this.userDAO.getUser(currentUserAlias);

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    await this.followDAO.putFollow(new Follow(currentUser, User.fromDto(userToFollow)!));

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followeeCount, followerCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    this.validateToken(token);
    const currentUserAlias = await this.getCurrentUserAlias(token);
    const currentUser = await this.userDAO.getUser(currentUserAlias);

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    await this.followDAO.deleteFollow(currentUser, User.fromDto(userToUnfollow)!);

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followeeCount, followerCount];
  }
}
