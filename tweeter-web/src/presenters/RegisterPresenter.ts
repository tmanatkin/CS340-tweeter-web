import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface RegisterView {
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  imageBytes: Uint8Array;
  imageFileExtension: string;
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

export class RegisterPresenter {
  private userService: UserService;
  private view: RegisterView;

  public constructor(view: RegisterView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async doRegister() {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.register(
        this.view.firstName,
        this.view.lastName,
        this.view.alias,
        this.view.password,
        this.view.imageBytes,
        this.view.imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(`Failed to register user because of exception: ${error}`);
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
