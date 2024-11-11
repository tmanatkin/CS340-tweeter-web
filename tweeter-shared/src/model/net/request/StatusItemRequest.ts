import { StatusDto } from "../../dto";

export interface StatusItemRequest {
  readonly token: string;
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: StatusDto | null;
}
