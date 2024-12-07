import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthDAO } from "../AuthDAO";
import { AuthToken } from "tweeter-shared";

export class DynamoDBAuthDAO implements AuthDAO {
  readonly tableName = "tweeter-tokens";
  readonly tokenAttr = "token";
  readonly timestampAttr = "timestamp";
  readonly aliasAttr = "alias";

  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-1" })
  );

  async getAuthToken(token: string): Promise<AuthToken | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.tokenAttr]: token
      }
    };
    const output = await this.client.send(new GetCommand(params));

    return output.Item
      ? new AuthToken(output.Item[this.tokenAttr], output.Item[this.timestampAttr])
      : null;
  }

  async putAuthToken(authToken: AuthToken, alias: string): Promise<AuthToken | null> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.tokenAttr]: authToken.token,
        [this.timestampAttr]: authToken.timestamp,
        [this.aliasAttr]: alias
      }
    };
    await this.client.send(new PutCommand(params));
    return authToken;
  }

  async deleteAuthToken(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.tokenAttr]: token
      }
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getAuthTokenAlias(token: string): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.tokenAttr]: token
      }
    };
    const output = await this.client.send(new GetCommand(params));

    return output.Item ? output.Item[this.aliasAttr] : null;
  }
}
