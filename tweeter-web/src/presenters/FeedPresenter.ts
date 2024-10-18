import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string) {
    return this.service.loadMoreFeedItems(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }

  protected getItemDescription() {
    return "load feed items";
  }
}
