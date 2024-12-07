import { Follow } from "tweeter-shared";
import { User } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";

export interface FollowDAO {
  getFollow(follower: User, followee: User): Promise<Follow | null>;
  putFollow(follow: Follow): Promise<void>;
  deleteFollow(follower: User, followee: User): Promise<void>;
  getPageOfFollowees(
    follower: User,
    pageSize: number,
    lastFollowee: User | undefined
    // ): Promise<DataPage<Follow>>;
  ): Promise<DataPage<string>>;
  getPageOfFollowers(
    followee: User,
    pageSize: number,
    lastFollower: User | undefined
    // ): Promise<DataPage<Follow>>;
  ): Promise<DataPage<string>>;
  getAllFolloweeAliases(followerAlias: string): Promise<string[]>;
  getAllFollowerAliases(followeeAlias: string): Promise<string[]>;
}
