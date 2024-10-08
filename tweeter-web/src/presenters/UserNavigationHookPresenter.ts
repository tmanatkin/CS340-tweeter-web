import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationHookView {
  displayErrorMessage: (message: string) => void;
  setDisplayedUser: (user: User) => void;
  authToken: AuthToken | null;
  currentUser: User | null;
}

export class UserNavigationHookPresenter {
  private userService: UserService;
  private view: UserNavigationHookView;

  public constructor(view: UserNavigationHookView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async navigateToUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.userService.getUser(this.view.authToken!, alias);

      if (!!user) {
        if (this.view.currentUser!.equals(user)) {
          this.view.setDisplayedUser(this.view.currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  }

  public extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}
