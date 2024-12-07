import { User } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoDBUserDAO implements UserDAO {
  readonly tableName = "tweeter-users";
  readonly aliasAttr = "alias";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly imageUrlAttr = "image_url";
  readonly passwordHashAttr = "password_hash";

  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-1" })
  );

  async getUser(alias: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias
      }
    };

    const output = await this.client.send(new GetCommand(params));
    return output.Item
      ? new User(
          output.Item[this.firstNameAttr],
          output.Item[this.lastNameAttr],
          output.Item[this.aliasAttr],
          output.Item[this.imageUrlAttr]
        )
      : null;
  }

  async getUserPasswordHash(alias: string): Promise<string | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias
      }
    };

    const output = await this.client.send(new GetCommand(params));
    return output.Item ? output.Item[this.passwordHashAttr] : null;
  }

  async putUser(
    firstName: string,
    lastName: string,
    alias: string,
    passwordHash: string,
    imageUrl: string
  ): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.firstNameAttr]: firstName,
        [this.lastNameAttr]: lastName,
        [this.aliasAttr]: alias,
        [this.passwordHashAttr]: passwordHash,
        [this.imageUrlAttr]: imageUrl
      }
    };
    await this.client.send(new PutCommand(params));
    return new User(firstName, lastName, alias, imageUrl);
  }
}
