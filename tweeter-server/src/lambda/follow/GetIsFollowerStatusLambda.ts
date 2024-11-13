import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { validateRequest } from "../../error/LambdaErrors";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
  validateRequest(request, ["token", "user", "selectedUser"]);
  const followService = new FollowService();
  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );
  return {
    success: true,
    message: null,
    isFollower: isFollower
  };
};
