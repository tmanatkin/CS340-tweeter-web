import { SQSClient, SetQueueAttributesCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: "us-east-1" });

const visibilityTimeout = 120; // seconds

async function setVisibilityTimeoutToZero(queueUrl: string) {
  try {
    const params = {
      QueueUrl: queueUrl,
      Attributes: {
        VisibilityTimeout: `${visibilityTimeout}`
      }
    };

    await sqsClient.send(new SetQueueAttributesCommand(params));
    console.log(`Visibility timeout set to ${visibilityTimeout} seconds.`);
  } catch (error) {
    console.error("Error setting visibility timeout:", error);
  }
}

// Call the function with your queue URL
setVisibilityTimeoutToZero("https://sqs.us-east-1.amazonaws.com/867344436360/TweeterPostsQ");
