import { AuthToken } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string) {
    return this.service.loadMoreFollowees(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }

  protected getItemDescription() {
    return "load followees";
  }
}
