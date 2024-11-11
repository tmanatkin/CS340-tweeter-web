import { PostStatusRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: PostStatusRequest): Promise<void> => {
  const userService = new UserService();
  await userService.postStatus(request.token, request.newStatus);
};
