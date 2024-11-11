import { StatusDto } from "../../dto";

export interface PostStatusRequest {
  readonly token: string;
  readonly newStatus: StatusDto;
}
