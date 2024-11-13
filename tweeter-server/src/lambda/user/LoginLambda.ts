import { LoginRequest, AuthenticationResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { validateRequest } from "../../error/LambdaErrors";

export const handler = async (request: LoginRequest): Promise<AuthenticationResponse> => {
  validateRequest(request, ["alias", "password"]);
  const userService = new UserService();
  const [user, authToken] = await userService.login(request.alias, request.password);
  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken
  };
};
