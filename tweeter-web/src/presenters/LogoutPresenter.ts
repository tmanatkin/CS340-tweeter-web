import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LogoutView {
  authToken: AuthToken | null;
  clearUserInfo: () => void;
  displayInfoMessage: (message: string, timeout: number) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
}

export class LogoutPresenter {
  private userService: UserService;
  private view: LogoutView;

  public constructor(view: LogoutView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async logOut() {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.userService.logout(this.view.authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user out because of exception: ${error}`);
    }
  }
}
