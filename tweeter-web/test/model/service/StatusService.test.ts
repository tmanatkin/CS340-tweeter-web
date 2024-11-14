import "isomorphic-fetch";
import { StatusService } from "../../../src/model/service/StatusService";
import { AuthToken, Status } from "tweeter-shared";

describe("StatusService Integration Test", () => {
  let statusService: StatusService;

  beforeAll(() => {
    statusService = new StatusService();
  });

  test("loadMoreStoryItems", async () => {
    const response = await statusService.loadMoreStoryItems(
      new AuthToken("token", Date.now()),
      "userAlias",
      10,
      null
    );
    expect(response).toEqual([expect.arrayContaining([expect.any(Status)]), expect.any(Boolean)]);
  });
});
