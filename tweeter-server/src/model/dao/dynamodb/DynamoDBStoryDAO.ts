import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { StoryDAO } from "../StoryDAO";
import { Status } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";

export class DynamoDBStoryDAO implements StoryDAO {
  readonly tableName = "tweeter-stories";
  readonly aliasAttr = "alias";
  readonly timestampAttr = "timestamp";
  readonly postAttr = "post";

  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-1" })
  );

  public async getPageOfStory(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<DataPage<{ alias: string; timestamp: number; post: string }>> {
    const params = {
      KeyConditionExpression: this.aliasAttr + " = :user",
      ExpressionAttributeValues: {
        ":user": { S: userAlias }
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem == null
          ? undefined
          : {
              [this.timestampAttr]: { N: lastItem.timestamp.toString() },
              [this.aliasAttr]: { S: userAlias }
            },
      ScanIndexForward: false
    };

    // const items: string[] = [];
    const items: { alias: string; timestamp: number; post: string }[] = [];

    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      // items.push(
      //   new Follow(follower, new User(item[this.followeeHandleAttr]?.S ?? "", "", "", ""))
      // );
      items.push({
        alias: item[this.aliasAttr].S ?? "",
        timestamp: Number(item[this.timestampAttr].N ?? ""),
        post: item[this.postAttr].S ?? ""
      });
    });
    // return new DataPage<Follow>(items, hasMorePages);
    return new DataPage<{ alias: string; timestamp: number; post: string }>(items, hasMorePages);
  }

  public async putStatus(newStatus: Status): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttr]: newStatus.user.alias,
        [this.timestampAttr]: newStatus.timestamp,
        [this.postAttr]: newStatus.post
      }
    };
    await this.client.send(new PutCommand(params));
  }
}
