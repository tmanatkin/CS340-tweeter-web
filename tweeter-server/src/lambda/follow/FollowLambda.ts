import { UserFollowActionRequest, UserFollowActionResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: UserFollowActionRequest
): Promise<UserFollowActionResponse> => {
  const followService = new FollowService();
  const [followeeCount, followerCount] = await followService.follow(request.token, request.user);
  return {
    success: true,
    message: null,
    followeeCount: followeeCount,
    followerCount: followerCount
  };
};
