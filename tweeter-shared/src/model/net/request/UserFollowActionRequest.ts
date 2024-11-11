import { UserDto } from "../../dto/UserDto";

export interface UserFollowActionRequest {
  readonly token: string;
  readonly user: UserDto;
}
