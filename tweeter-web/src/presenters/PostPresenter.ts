import { Status } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import {
  AuthTokenView,
  CurrentUserView,
  MessageView,
  Presenter,
  SetIsLoadingView
} from "./Presenter";

export interface PostView extends MessageView, SetIsLoadingView, AuthTokenView, CurrentUserView {
  post: string;
  setPost: React.Dispatch<React.SetStateAction<string>>;
}

export class PostPresenter extends Presenter<PostView> {
  private userService: UserService;

  public constructor(view: PostView) {
    super(view);
    this.userService = new UserService();
  }

  public async submitPost(event: React.MouseEvent) {
    event.preventDefault();

    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(this.view.post, this.view.currentUser!, Date.now());

        await this.userService.postStatus(this.view.authToken!, status);

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
