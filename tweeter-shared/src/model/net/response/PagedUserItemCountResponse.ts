import { TweeterResponse } from "./TweeterResponse";

export interface PagedUserItemCountResponse extends TweeterResponse {
  readonly count: number;
}
