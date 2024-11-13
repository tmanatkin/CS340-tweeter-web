import { PostStatusRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { validateRequest } from "../../error/LambdaErrors";

export const handler = async (request: PostStatusRequest): Promise<void> => {
  validateRequest(request, ["token", "newStatus"]);
  const userService = new UserService();
  await userService.postStatus(request.token, request.newStatus);
};
