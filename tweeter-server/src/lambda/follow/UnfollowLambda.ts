import { UserFollowActionRequest, UserFollowActionResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { validateRequest } from "../../error/LambdaErrors";

export const handler = async (
  request: UserFollowActionRequest
): Promise<UserFollowActionResponse> => {
  validateRequest(request, ["token", "user"]);
  const followService = new FollowService();
  const [followeeCount, followerCount] = await followService.unfollow(request.token, request.user);
  return {
    success: true,
    message: null,
    followeeCount: followeeCount,
    followerCount: followerCount
  };
};
