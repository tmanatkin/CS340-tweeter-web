import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface PostView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, timeout: number) => void;
  clearLastInfoMessage: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  authToken: AuthToken | null;
  currentUser: User | null;
  post: string;
  setPost: React.Dispatch<React.SetStateAction<string>>;
}

export class PostPresenter {
  private userService: UserService;
  private view: PostView;

  public constructor(view: PostView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async submitPost(event: React.MouseEvent) {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(this.view.post, this.view.currentUser!, Date.now());

      await this.userService.postStatus(this.view.authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
