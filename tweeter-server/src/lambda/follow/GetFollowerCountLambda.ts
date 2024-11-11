import { PagedUserItemCountRequest, PagedUserItemCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: PagedUserItemCountRequest
): Promise<PagedUserItemCountResponse> => {
  const followService = new FollowService();
  const count = await followService.getFollowerCount(request.token, request.user);
  return {
    success: true,
    message: null,
    count: count
  };
};
