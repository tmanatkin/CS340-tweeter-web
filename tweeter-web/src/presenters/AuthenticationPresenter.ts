import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { View, Presenter } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthenticationView extends View {
  alias: string;
  password: string;
  rememberMe: boolean;
  setImageFileExtension?: React.Dispatch<React.SetStateAction<string>>;
  navigate: NavigateFunction;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
}
export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
  public userService: UserService;

  public constructor(view: AuthenticationView) {
    super(view);
    this.userService = new UserService();
  }

  protected authenticateOperation = async (authOperation: () => Promise<[User, AuthToken]>) => {
    this.view.setIsLoading(true);
    const [user, authToken] = await authOperation();
    this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);
  };
}
