import { StatusItemRequest, StatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: StatusItemRequest): Promise<StatusItemResponse> => {
  const statusService = new StatusService();
  const [items, hasMore] = await statusService.loadMoreStoryItems(
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
