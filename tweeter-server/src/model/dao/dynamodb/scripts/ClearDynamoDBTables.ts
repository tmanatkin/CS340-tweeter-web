import { DynamoDBClient, ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

async function clearTable(tableName: string, primaryKeySchema: string[]) {
  // Scan the table to retrieve all items
  const scanCommand = new ScanCommand({ TableName: tableName });
  const scanResult = await client.send(scanCommand);

  if (scanResult.Items) {
    for (const item of scanResult.Items) {
      const key: { [key: string]: any } = {};

      // Dynamically build the key based on the primaryKeySchema
      primaryKeySchema.forEach((keyName) => {
        if (item[keyName]) {
          key[keyName] = item[keyName];
        }
      });

      const deleteCommand = new DeleteItemCommand({
        TableName: tableName,
        Key: key
      });
      await client.send(deleteCommand);
      console.log(`Deleted item with key: ${JSON.stringify(key)}`);
    }
  }
}

async function clearTables() {
  // Define the primary key schema for each table
  const tableSchemas = [
    // {
    //   tableName: "tweeter-feed",
    //   primaryKeySchema: ["follower_alias", "timestamp"]
    // },
    {
      tableName: "tweeter-stories",
      primaryKeySchema: ["alias", "timestamp"]
    },
    {
      tableName: "tweeter-tokens",
      primaryKeySchema: ["token"]
    }
    // {
    //   tableName: "tweeter-follows",
    //   primaryKeySchema: ["follower_handle", "followee_handle"]
    // },
    // {
    //   tableName: "tweeter-users",
    //   primaryKeySchema: ["alias"]
    // }
  ];

  // Clear each table
  for (const { tableName, primaryKeySchema } of tableSchemas) {
    console.log(`Clearing table: ${tableName}`);
    await clearTable(tableName, primaryKeySchema);
  }
}

clearTables().catch(console.error);
