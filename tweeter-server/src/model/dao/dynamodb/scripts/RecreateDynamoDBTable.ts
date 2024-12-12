import { DynamoDBClient, DeleteTableCommand, CreateTableCommand } from "@aws-sdk/client-dynamodb";

// Initialize DynamoDB client
const dynamoDB = new DynamoDBClient({ region: "us-east-1" }); // Set your preferred AWS region

// Define parameters
interface TableParams {
  tableName: string;
  partitionKey: string;
  sortKey: string;
  rcu: number; // Read Capacity Units
  wcu: number; // Write Capacity Units
}

// Function to delete and recreate a DynamoDB table
async function deleteAndRecreateTable(params: TableParams) {
  try {
    // Step 1: Delete the table if it exists
    console.log(`Deleting table: ${params.tableName}`);
    const deleteParams = new DeleteTableCommand({ TableName: params.tableName });
    await dynamoDB.send(deleteParams);
    console.log(`Table ${params.tableName} deleted successfully.`);

    // Wait for the table to be deleted (optional, add delay if needed)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Step 2: Create a new table with the provided keys and capacity units
    console.log(`Creating table: ${params.tableName}`);
    const createParams = new CreateTableCommand({
      TableName: params.tableName,
      KeySchema: [
        { AttributeName: params.partitionKey, KeyType: "HASH" }, // Partition key
        { AttributeName: params.sortKey, KeyType: "RANGE" } // Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: params.partitionKey, AttributeType: "S" }, // Partition key type (string)
        { AttributeName: params.sortKey, AttributeType: "S" } // Sort key type (string)
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: params.rcu,
        WriteCapacityUnits: params.wcu
      }
    });

    await dynamoDB.send(createParams);
    console.log(`Table ${params.tableName} created successfully.`);
  } catch (error) {
    console.error("Error during table operation:", error);
  }
}

// Example usage
const params: TableParams = {
  tableName: "tweeter-feed",
  partitionKey: "follower_alias",
  sortKey: "timestamp",
  rcu: 100, // Set read capacity units
  wcu: 100 // Set write capacity units
};

deleteAndRecreateTable(params);
