import {
  AuthenticationResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LogoutRequest,
  PagedUserItemCountRequest,
  PagedUserItemCountResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  RegisterRequest,
  StatusItemRequest,
  StatusItemResponse,
  TweeterResponse,
  UserFollowActionRequest,
  UserFollowActionResponse,
  UserRequest,
  UserResponse,
  Status,
  User,
  AuthToken
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://6wnv9wxaig.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async getMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async getIsFollowerStatus(request: IsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<IsFollowerRequest, IsFollowerResponse>(
      request,
      "/is-follower"
    );

    // Handle errors
    if (response.success) {
      if (response.isFollower == null) {
        throw new Error(`No user found`);
      } else {
        return response.isFollower;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async getFolloweeCount(request: PagedUserItemCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemCountRequest,
      PagedUserItemCountResponse
    >(request, "/followee/count");

    // Handle errors
    if (response.success) {
      if (response.count == null) {
        throw new Error(`No followees found`);
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async getFollowerCount(request: PagedUserItemCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemCountRequest,
      PagedUserItemCountResponse
    >(request, "/follower/count");

    // Handle errors
    if (response.success) {
      if (response.count == null) {
        throw new Error(`No followers found`);
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async follow(
    request: UserFollowActionRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      UserFollowActionRequest,
      UserFollowActionResponse
    >(request, "/follow");

    // Handle errors
    if (response.success) {
      if (response.followeeCount == null || response.followerCount == null) {
        throw new Error(`Error following user`);
      } else {
        return [response.followerCount, response.followeeCount];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async unfollow(
    request: UserFollowActionRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      UserFollowActionRequest,
      UserFollowActionResponse
    >(request, "/unfollow");

    // Handle errors
    if (response.success) {
      if (response.followeeCount == null || response.followerCount == null) {
        throw new Error(`Error unfollowing user`);
      } else {
        return [response.followerCount, response.followeeCount];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async getMoreFeedItems(request: StatusItemRequest): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<StatusItemRequest, StatusItemResponse>(
      request,
      "/feed"
    );

    // Convert the StatusDto array returned by ClientCommunicator to a Status array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No feed found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async getMoreStoryItems(request: StatusItemRequest): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<StatusItemRequest, StatusItemResponse>(
      request,
      "/story"
    );

    // Convert the StatusDto array returned by ClientCommunicator to a Status array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No feed found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async getUser(request: UserRequest): Promise<User> {
    const response = await this.clientCommunicator.doPost<UserRequest, UserResponse>(
      request,
      "/user"
    );

    // Convert the UserDto returned by ClientCommunicator to a User
    const user: User | null =
      response.success && response.user ? User.fromDto(response.user) : null;

    // Handle errors
    if (response.success) {
      if (user == null) {
        throw new Error(`User not found`);
      } else {
        return user;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<RegisterRequest, AuthenticationResponse>(
      request,
      "/register"
    );

    // Convert the UserDto returned by ClientCommunicator to a User
    const user: User | null =
      response.success && response.user ? User.fromDto(response.user) : null;

    // Convert the AuthTokenDto returned by ClientCommunicator to an AuthToken
    const authToken: AuthToken | null =
      response.success && response.authToken ? AuthToken.fromDto(response.authToken) : null;

    // Handle errors
    if (response.success) {
      if (user == null) {
        throw new Error(`User not found`);
      } else if (authToken == null) {
        throw new Error(`Authtoken not found`);
      } else {
        return [user, authToken];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<LoginRequest, AuthenticationResponse>(
      request,
      "/login"
    );

    // Convert the UserDto returned by ClientCommunicator to a User
    const user: User | null =
      response.success && response.user ? User.fromDto(response.user) : null;

    // Convert the AuthTokenDto returned by ClientCommunicator to an AuthToken
    const authToken: AuthToken | null =
      response.success && response.authToken ? AuthToken.fromDto(response.authToken) : null;

    // Handle errors
    if (response.success) {
      if (user == null) {
        throw new Error(`User not found`);
      } else if (authToken == null) {
        throw new Error(`Authtoken not found`);
      } else {
        return [user, authToken];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(request, "/logout");
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(request, "/status");
  }
}
