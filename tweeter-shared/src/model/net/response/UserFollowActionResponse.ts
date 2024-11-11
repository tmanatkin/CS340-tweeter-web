import { TweeterResponse } from "./TweeterResponse";

export interface UserFollowActionResponse extends TweeterResponse {
  readonly followeeCount: number;
  readonly followerCount: number;
}
