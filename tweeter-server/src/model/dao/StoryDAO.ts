import { Status } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";

export interface StoryDAO {
  getPageOfStory(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<DataPage<{ alias: string; timestamp: number; post: string }>>;
  putStatus(newStatus: Status): Promise<void>;
}
