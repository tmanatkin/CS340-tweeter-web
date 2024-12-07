import { FollowDAO } from "../FollowDAO";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Follow, User } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";

export class DynamoDBFollowDAO implements FollowDAO {
  readonly tableName = "tweeter-follows";
  readonly indexName = "follows_index";
  readonly followerHandleAttr = "follower_handle";
  readonly followeeHandleAttr = "followee_handle";

  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-1" })
  );

  public async getFollow(follower: User, followee: User): Promise<Follow | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerHandleAttr]: follower.alias,
        [this.followeeHandleAttr]: followee.alias
      }
    };
    const output = await this.client.send(new GetCommand(params));

    return output.Item ? new Follow(follower, followee) : null;
  }

  public async putFollow(follow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerHandleAttr]: follow.follower.alias,
        [this.followeeHandleAttr]: follow.followee.alias
      }
    };
    await this.client.send(new PutCommand(params));
  }

  public async deleteFollow(follower: User, followee: User): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerHandleAttr]: follower.alias,
        [this.followeeHandleAttr]: followee.alias
      }
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getPageOfFollowees(
    follower: User,
    pageSize: number,
    lastFollowee: User | undefined
    // ): Promise<DataPage<Follow>> {
  ): Promise<DataPage<string>> {
    const params = {
      KeyConditionExpression: this.followerHandleAttr + " = :user",
      ExpressionAttributeValues: {
        ":user": { S: follower.alias }
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowee === undefined
          ? undefined
          : {
              [this.followeeHandleAttr]: { S: lastFollowee.alias },
              [this.followerHandleAttr]: { S: follower.alias }
            }
    };

    // const items: Follow[] = [];
    const items: string[] = [];

    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      // items.push(
      //   new Follow(follower, new User(item[this.followeeHandleAttr]?.S ?? "", "", "", ""))
      // );
      items.push(item[this.followeeHandleAttr]?.S ?? "");
    });
    // return new DataPage<Follow>(items, hasMorePages);
    return new DataPage<string>(items, hasMorePages);
  }

  async getPageOfFollowers(
    followee: User,
    pageSize: number,
    lastFollower: User | undefined
    // ): Promise<DataPage<Follow>> {
  ): Promise<DataPage<string>> {
    const params = {
      KeyConditionExpression: this.followeeHandleAttr + " = :user",
      ExpressionAttributeValues: {
        ":user": { S: followee.alias }
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollower === undefined
          ? undefined
          : {
              [this.followerHandleAttr]: { S: lastFollower.alias },
              [this.followeeHandleAttr]: { S: followee.alias }
            }
    };

    // const items: Follow[] = [];
    const items: string[] = [];

    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      // items.push(new Follow(new User(item[this.followerHandleAttr]?.S ?? "", "", "", ""), followee))
      items.push(item[this.followerHandleAttr]?.S ?? "");
    });

    // return new DataPage<Follow>(items, hasMorePages);
    return new DataPage<string>(items, hasMorePages);
  }

  async getAllFolloweeAliases(followerAlias: string): Promise<string[]> {
    const params = {
      KeyConditionExpression: this.followerHandleAttr + " = :user",
      ExpressionAttributeValues: {
        ":user": { S: followerAlias }
      },
      TableName: this.tableName
    };

    const aliases: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    data.Items?.forEach((item) => aliases.push(item[this.followeeHandleAttr]?.S ?? ""));

    return aliases;
  }

  async getAllFollowerAliases(followeeAlias: string): Promise<string[]> {
    const params = {
      KeyConditionExpression: this.followeeHandleAttr + " = :user",
      ExpressionAttributeValues: {
        ":user": { S: followeeAlias }
      },
      TableName: this.tableName,
      IndexName: this.indexName
    };

    const aliases: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    data.Items?.forEach((item) => aliases.push(item[this.followerHandleAttr]?.S ?? ""));

    return aliases;
  }
}
