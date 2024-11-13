import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { validateRequest } from "../../error/LambdaErrors";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  validateRequest(request, ["token", "userAlias", "pageSize"]);
  const followService = new FollowService();
  const [items, hasMore] = await followService.loadMoreFollowers(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );
  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore
  };
};
