import { StatusDto } from "../../dto";
import { TweeterResponse } from "./TweeterResponse";

export interface StatusItemResponse extends TweeterResponse {
  readonly items: StatusDto[] | null;
  readonly hasMore: boolean;
}
