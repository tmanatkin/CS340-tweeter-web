import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginView, LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { instance, mock, verify } from "ts-mockito";

library.add(fab);

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login
          originalUrl={originalUrl}
          presenterGenerator={(view: LoginView) => new LoginPresenter(view)}
          presenter={presenter}
        />
      ) : (
        <Login
          originalUrl={originalUrl}
          presenterGenerator={(view: LoginView) => new LoginPresenter(view)}
        />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (originalUrl: string, presenter?: LoginPresenter) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign In/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};

describe("Login Component", () => {
  it("first renders with the sign-in button disabled", () => {});
  const { signInButton } = renderLoginAndGetElements("/");
  expect(signInButton).toBeDisabled();

  it("enables the sign-in button if both alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/");

    await user.type(aliasField, "alias");
    await user.type(passwordField, "password");

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign-in button if either alias or password is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/");

    await user.type(aliasField, "alias");
    await user.type(passwordField, "password");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "alias");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenters login method with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const alias = "@alias";
    const password = "password";
    const rememberMe = false;
    const originalUrl = "http://url.com";

    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements(
      originalUrl,
      mockPresenterInstance
    );

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, rememberMe, originalUrl)).once();
  });
});
