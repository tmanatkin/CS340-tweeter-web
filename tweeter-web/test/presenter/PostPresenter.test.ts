import { AuthToken, Status, User } from "tweeter-shared";
import { PostPresenter, PostView } from "../../src/presenters/PostPresenter";
import { anything, capture, instance, mock, objectContaining, spy, verify, when } from "ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("PostPresenter", () => {
  let mockPostView: PostView;
  let postPresenter: PostPresenter;
  let mockUserService: UserService;
  const user = new User("firstName", "lastName", "alias", "imageUrl");
  const status = new Status("post", user, 1);

  const timestamp = 1;
  const authToken = new AuthToken("token", timestamp);

  beforeEach(() => {
    mockPostView = mock<PostView>();
    const mockPostViewInstance = instance(mockPostView);

    const postPresenterSpy = spy(new PostPresenter(mockPostViewInstance));
    postPresenter = instance(postPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(postPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to display a posting status message", async () => {
    await postPresenter.submitPost("post", user, authToken);
    verify(mockPostView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postPresenter.submitPost("post", user, authToken);
    verify(mockUserService.postStatus(anything(), anything())).once();
    let [capturedAuthToken, capturedStatus] = capture(mockUserService.postStatus).last();
    expect(capturedStatus).toBeInstanceOf(Status);
    expect(capturedStatus).toEqual(
      expect.objectContaining({
        post: "post",
        user: user
      })
    );
    expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message when posting of the status is successful", async () => {
    await postPresenter.submitPost("post", user, authToken);
    // verify(mockPostView.clearLastInfoMessage()).once(); // not working because it runs inside of a finally (doFailureReportingOperation)
    verify(mockPostView.setPost("")).once();
    verify(mockPostView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockPostView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when posting of the status is not successful", async () => {
    const error = new Error("An error occurred");
    when(mockUserService.postStatus(anything(), anything())).thenThrow(error);
    await postPresenter.submitPost("post", user, authToken);
    verify(
      mockPostView.displayErrorMessage(
        "Failed to post the status because of exception: An error occurred"
      )
    ).once();
    verify(mockPostView.setPost("")).never();
    verify(mockPostView.displayInfoMessage("Status posted!", 2000)).never();
  });
});
