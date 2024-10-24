import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter, SetIsLoadingView } from "./Presenter";

export interface PostView extends MessageView, SetIsLoadingView {
  setPost: React.Dispatch<React.SetStateAction<string>>;
}

export class PostPresenter extends Presenter<PostView> {
  private _userService: UserService;

  public constructor(view: PostView) {
    super(view);
    this._userService = new UserService();
  }

  public get userService() {
    return this._userService;
  }

  public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(post, currentUser!, Date.now());

        await this.userService.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      async () => {
        this.view.clearLastInfoMessage();
        this.view.setIsLoading(false);
      }
    );
  }
}
