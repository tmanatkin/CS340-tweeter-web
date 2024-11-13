import { UserRequest, UserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { validateRequest } from "../../error/LambdaErrors";

export const handler = async (request: UserRequest): Promise<UserResponse> => {
  validateRequest(request, ["token", "userAlias"]);
  const userService = new UserService();
  const user = await userService.getUser(request.token, request.userAlias);
  return {
    success: true,
    message: null,
    user: user
  };
};
