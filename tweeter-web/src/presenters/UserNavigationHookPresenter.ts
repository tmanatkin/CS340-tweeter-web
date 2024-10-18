import { User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, CurrentUserView, AuthTokenView } from "./Presenter";

export interface UserNavigationHookView extends CurrentUserView, AuthTokenView {
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationHookPresenter extends Presenter<UserNavigationHookView> {
  private userService: UserService;

  public constructor(view: UserNavigationHookView) {
    super(view);
    this.userService = new UserService();
  }

  public async navigateToUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.userService.getUser(this.view.authToken!, alias);

      if (!!user) {
        if (this.view.currentUser!.equals(user)) {
          this.view.setDisplayedUser(this.view.currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  }

  public extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}
