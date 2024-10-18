import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {
  originalUrl: string | undefined;
}

export class LoginPresenter extends AuthenticationPresenter {
  public get view() {
    return super.view as LoginView;
  }

  public async doLogin() {
    this.doFailureReportingOperation(
      async () => {
        this.authenticateOperation(async () => {
          return this.userService.login(this.view.alias, this.view.password);
        });

        if (!!this.view.originalUrl) {
          this.view.navigate(this.view.originalUrl);
        } else {
          this.view.navigate("/");
        }
      },
      "log user in",
      async () => {
        this.view.setIsLoading(false);
      }
    );
  }
}
