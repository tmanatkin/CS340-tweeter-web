import { UserDto } from "../../dto/UserDto";

export interface PagedUserItemCountRequest {
  readonly token: string;
  readonly user: UserDto;
}
