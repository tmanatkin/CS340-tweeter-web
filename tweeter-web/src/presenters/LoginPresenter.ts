import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface LoginView {
  originalUrl: string | undefined;
  alias: string;
  password: string;
  rememberMe: boolean;
  navigate: NavigateFunction;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
  private userService: UserService;
  private view: LoginView;

  public constructor(view: LoginView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async doLogin() {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.login(this.view.alias, this.view.password);

      this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);

      if (!!this.view.originalUrl) {
        this.view.navigate(this.view.originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
