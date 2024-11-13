import { LogoutRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { validateRequest } from "../../error/LambdaErrors";

export const handler = async (request: LogoutRequest): Promise<void> => {
  validateRequest(request, ["token"]);
  const userService = new UserService();
  await userService.logout(request.token);
};
