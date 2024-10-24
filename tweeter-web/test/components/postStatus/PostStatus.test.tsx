import React from "react";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { PostView, PostPresenter } from "../../../src/presenters/PostPresenter";
import { anything, capture, instance, mock, verify } from "ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";

library.add(fab);

const renderLogin = (presenter?: PostPresenter) => {
  return render(
    <>
      {!!presenter ? (
        <PostStatus
          presenterGenerator={(view: PostView) => new PostPresenter(view)}
          presenter={presenter}
        />
      ) : (
        <PostStatus presenterGenerator={(view: PostView) => new PostPresenter(view)} />
      )}
    </>
  );
};

const renderLoginAndGetElements = (presenter?: PostPresenter) => {
  const user = userEvent.setup();

  renderLogin(presenter);

  const postText = screen.getByLabelText("post text");
  const postButton = screen.getByLabelText("post");
  const clearButton = screen.getByLabelText("clear");

  return { postText, postButton, clearButton, user };
};

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn()
}));

describe("PostStatus Component", () => {
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;

  beforeAll(() => {
    const mockUser = mock<User>();
    mockUserInstance = instance(mockUser);

    const mockAuthToken = mock<AuthToken>();
    mockAuthTokenInstance = instance(mockAuthToken);

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance
    });
  });

  it("first renders with post status and clear buttons disabled", () => {
    const { postButton, clearButton } = renderLoginAndGetElements();
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables buttons if the text field has text", async () => {
    const { postText, postButton, clearButton, user } = renderLoginAndGetElements();

    await user.type(postText, "post");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables buttons if the text field is cleared", async () => {
    const { postText, postButton, clearButton, user } = renderLoginAndGetElements();

    await user.type(postText, "post");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(postText);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenters postStatus method with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<PostPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const post = "post";

    const { postText, postButton, user } = renderLoginAndGetElements(mockPresenterInstance);

    await user.type(postText, post);

    await user.click(postButton);

    verify(mockPresenter.submitPost(post, mockUserInstance, mockAuthTokenInstance)).once();
  });
});
