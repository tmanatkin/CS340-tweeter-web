import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string) {
    return this.service.loadMoreStoryItems(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }

  protected getItemDescription() {
    return "load story items";
  }
}
