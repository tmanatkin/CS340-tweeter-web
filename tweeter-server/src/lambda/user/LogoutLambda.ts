import { LogoutRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: LogoutRequest): Promise<void> => {
  const userService = new UserService();
  await userService.logout(request.token);
};
