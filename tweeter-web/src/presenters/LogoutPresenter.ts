import { UserService } from "../model/service/UserService";
import { Presenter, MessageView, AuthTokenView } from "./Presenter";

export interface LogoutView extends MessageView, AuthTokenView {
  clearUserInfo: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private userService: UserService;

  public constructor(view: LogoutView) {
    super(view);
    this.userService = new UserService();
  }

  public async logOut() {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this.userService.logout(this.view.authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}
