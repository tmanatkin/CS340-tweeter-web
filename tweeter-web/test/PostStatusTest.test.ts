import "isomorphic-fetch";
import { AuthToken, LoginRequest, Status, User } from "tweeter-shared";
import { ServerFacade } from "../src/model/net/ServerFacade";
import { PostPresenter, PostView } from "../src/presenters/PostPresenter";
import { instance, mock, spy, verify, when } from "ts-mockito";
import { UserService } from "../src/model/service/UserService";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;
  let mockPostView: PostView;
  let postPresenter: PostPresenter;
  // let mockUserService: UserService;
  let user: User;
  let authToken: AuthToken;
  const post = `Test post. ${Math.floor(1000 + Math.random() * 9000)}`; // random 4 digit number

  beforeAll(() => {
    serverFacade = new ServerFacade();

    // mockPostView = mock<PostView>();
    mockPostView = {
      setPost: jest.fn(),
      displayInfoMessage: jest.fn(),
      setIsLoading: jest.fn(),
      clearLastInfoMessage: jest.fn(),
      displayErrorMessage: jest.fn()
    };

    // const mockPostViewInstance = instance(mockPostView);

    // const postPresenterSpy = spy(new PostPresenter(mockPostViewInstance));
    // postPresenter = instance(postPresenterSpy);
    postPresenter = new PostPresenter(mockPostView);

    // mockUserService = mock<UserService>();
    // const mockUserServiceInstance = instance(mockUserService);

    // when(postPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  test("User Login", async () => {
    const loginRequest: LoginRequest = {
      alias: "123",
      password: "123"
    };
    const response = await serverFacade.login(loginRequest);
    expect(response).toEqual([expect.any(User), expect.any(AuthToken)]);
    expect(response[0].alias).toBe(`@${loginRequest.alias}`);
    user = response[0];
    authToken = response[1];
  });

  test("Post Status", async () => {
    await postPresenter.submitPost(post, user, authToken);
    console.log("Wait 3 seconds for info messages...");
    await new Promise((f) => setTimeout(f, 3000));
    // verify(mockPostView.setPost("")).once();
    // verify(mockPostView.displayInfoMessage("Status posted!", 2000)).once();
    // verify(mockPostView.displayErrorMessage(anything())).never();
    expect(mockPostView.displayInfoMessage).toHaveBeenCalledWith("Posting status...", 0);
    expect(mockPostView.displayInfoMessage).toHaveBeenCalledWith("Status posted!", 2000);
    expect(mockPostView.displayInfoMessage).toHaveBeenCalledTimes(2);
  }, 10000); // increase timeout to 10 seconds

  test("Verify Status Posted to Story", async () => {
    console.log("Wait 30 seconds for status to post...");
    await new Promise((f) => setTimeout(f, 30000));
    const response = await serverFacade.getMoreStoryItems({
      token: authToken.token,
      userAlias: user.alias,
      pageSize: 10,
      lastItem: null
    });
    expect(response).toEqual([expect.arrayContaining([expect.any(Status)]), expect.any(Boolean)]);
    expect(response[0][0].post).toBe(post);
  }, 100000); // increase timeout to 100 seconds
});
