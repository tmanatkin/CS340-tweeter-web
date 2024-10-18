import { AuthToken } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string) {
    return this.service.loadMoreFollowers(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }

  protected getItemDescription() {
    return "load followers";
  }
}
