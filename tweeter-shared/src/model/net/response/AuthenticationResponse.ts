import { UserDto } from "../../dto";
import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { TweeterResponse } from "./TweeterResponse";

export interface AuthenticationResponse extends TweeterResponse {
  readonly user: UserDto;
  readonly authToken: AuthTokenDto;
}
