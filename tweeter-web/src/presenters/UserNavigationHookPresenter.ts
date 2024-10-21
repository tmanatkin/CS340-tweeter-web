import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationHookView extends View {
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationHookPresenter extends Presenter<UserNavigationHookView> {
  private userService: UserService;

  public constructor(view: UserNavigationHookView) {
    super(view);
    this.userService = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User
  ): Promise<void> {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
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
