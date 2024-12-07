import { Status } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";

export interface FeedDAO {
  getPageOfFeed(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<DataPage<{ alias: string; timestamp: number; post: string }>>;
  putStatus(followerAliases: string[], newStatus: Status): Promise<void>;
}
