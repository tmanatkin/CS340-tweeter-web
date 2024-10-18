import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView, AuthTokenView } from "./Presenter";

export interface UserInfoView extends MessageView, AuthTokenView {
  setIsFollower: React.Dispatch<React.SetStateAction<boolean>>;
  setFolloweeCount: React.Dispatch<React.SetStateAction<number>>;
  setFollowerCount: React.Dispatch<React.SetStateAction<number>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  displayedUser: User | null;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private userService: UserService;

  public constructor(view: UserInfoView) {
    super(view);
    this.userService = new UserService();
  }

  public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
    }, "get followers count");
  }

  public async followDisplayedUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage(`Following ${this.view.displayedUser!.name}...`, 0);

        const [followerCount, followeeCount] = await this.userService.follow(
          this.view.authToken!,
          this.view.displayedUser!
        );

        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      "follow user",
      async () => {
        this.view.clearLastInfoMessage();
        this.view.setIsLoading(false);
      }
    );
  }

  public async unfollowDisplayedUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage(`Unfollowing ${this.view.displayedUser!.name}...`, 0);

        const [followerCount, followeeCount] = await this.userService.unfollow(
          this.view.authToken!,
          this.view.displayedUser!
        );

        this.view.setIsFollower(false);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      "unfollow user",
      async () => {
        this.view.clearLastInfoMessage();
        this.view.setIsLoading(false);
      }
    );
  }
}
