import { DescribeTableCommand, DynamoDBClient, UpdateTableCommand } from "@aws-sdk/client-dynamodb";

const newReadWriteCapacity = 20;
const tableNames = [
  "tweeter-feed",
  "tweeter-follows",
  "tweeter-stories",
  "tweeter-tokens",
  "tweeter-users"
];

const client = new DynamoDBClient({ region: "us-east-1" });

async function adjustDynamoDBProvisions() {
  try {
    let totalCurrentReadWriteCapacity = 0;

    for (const tableName of tableNames) {
      const describeParams = {
        TableName: tableName
      };
      const describeTableCommand = new DescribeTableCommand(describeParams);
      const tableData = await client.send(describeTableCommand);
      const currentReadCapacity = tableData.Table?.ProvisionedThroughput?.ReadCapacityUnits ?? 0;
      const currentWriteCapacity = tableData.Table?.ProvisionedThroughput?.WriteCapacityUnits ?? 0;

      if (
        currentReadCapacity === newReadWriteCapacity ||
        currentWriteCapacity === newReadWriteCapacity
      ) {
        totalCurrentReadWriteCapacity +=
          (currentReadCapacity + currentWriteCapacity) * tableNames.length;
        break;
      }

      const updateParams = {
        TableName: tableName,
        ProvisionedThroughput: {
          ReadCapacityUnits: newReadWriteCapacity,
          WriteCapacityUnits: newReadWriteCapacity
        }
      };

      const updateTableCommand = new UpdateTableCommand(updateParams);
      await client.send(updateTableCommand);
      // console.log(
      //   `${tableName}\nfrom\tR: ${currentReadCapacity}\tW: ${currentWriteCapacity}\nto\tR: ${newReadWriteCapacity}\tW: ${newReadWriteCapacity}\n`
      // );
      totalCurrentReadWriteCapacity += currentReadCapacity + currentWriteCapacity;
    }
    const currentReadWriteCapacity = totalCurrentReadWriteCapacity / 2 / tableNames.length;
    console.log(`from ${currentReadWriteCapacity} to ${newReadWriteCapacity}`);
  } catch (error) {
    console.error("Error updating tables:", error);
  }
}

adjustDynamoDBProvisions();
