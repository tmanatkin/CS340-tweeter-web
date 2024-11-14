import "isomorphic-fetch";
import { Buffer } from "buffer";
import {
  AuthToken,
  PagedUserItemCountRequest,
  PagedUserItemRequest,
  RegisterRequest,
  User
} from "tweeter-shared";
import { ServerFacade } from "../../../src/model/net/ServerFacade";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  test("register", async () => {
    const registerRequest: RegisterRequest = {
      firstName: "firstName",
      lastName: "lastName",
      alias: "alias",
      password: "password",
      userImageBytes: Buffer.from(new Uint8Array(10)),
      imageFileExtension: ".ext"
    };
    const response = await serverFacade.register(registerRequest);
    expect(response).toEqual([expect.any(User), expect.any(AuthToken)]);
  });

  test("getMoreFollowers", async () => {
    const getMoreFollowersRequest: PagedUserItemRequest = {
      token: "token",
      userAlias: "userAlias",
      pageSize: 10,
      lastItem: null
    };
    const response = await serverFacade.getMoreFollowers(getMoreFollowersRequest);
    expect(response).toEqual([expect.arrayContaining([expect.any(User)]), expect.any(Boolean)]);
  });

  test("getFolloweeCount", async () => {
    const testUser = new User("firstName", "lastName", "alias", "imageUrl");
    const getFolloweeCountRequest: PagedUserItemCountRequest = {
      token: "token",
      user: testUser
    };
    const response = await serverFacade.getFolloweeCount(getFolloweeCountRequest);
    expect(response).toEqual(expect.any(Number));
  });
});
