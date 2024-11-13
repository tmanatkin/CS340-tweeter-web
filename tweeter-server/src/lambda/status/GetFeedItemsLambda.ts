import { StatusItemRequest, StatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { validateRequest } from "../../error/LambdaErrors";

export const handler = async (request: StatusItemRequest): Promise<StatusItemResponse> => {
  validateRequest(request, ["token", "userAlias", "pageSize"]);
  const statusService = new StatusService();
  const [items, hasMore] = await statusService.loadMoreFeedItems(
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
