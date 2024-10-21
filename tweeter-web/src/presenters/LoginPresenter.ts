import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {}

export class LoginPresenter extends AuthenticationPresenter {
  public get view() {
    return super.view as LoginView;
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
    this.doFailureReportingOperation(
      async () => {
        this.authenticateOperation(async () => {
          return this.userService.login(alias, password);
        }, rememberMe);

        if (!!originalUrl) {
          this.view.navigate(originalUrl);
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
