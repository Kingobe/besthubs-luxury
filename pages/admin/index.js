const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
const sqs = new SQSClient({ region: "us-west-2" });

exports.handler = async () => {
  try {
    const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    console.log(`Scanning Orders for endDate: ${twoDaysFromNow}, status: rented`);

    const { Items = [] } = await docClient.send(new ScanCommand({
      TableName: "Orders",
      FilterExpression: "endDate = :end AND status = :status",
      ExpressionAttributeValues: { ":end": twoDaysFromNow, ":status": "rented" },
    }));

    console.log(`Found ${Items.length} items`);

    for (const item of Items) {
      console.log(`Queueing message for ${item.email}`);
      await sqs.send(new SendMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL,
        MessageBody: JSON.stringify({
          to: item.email,
          subject: "Rental Reminder",
          body: `Your shisha bowl rental ends on ${item.endDate}. Please return it on time.`,
        }),
      }));
    }

    return { statusCode: 200, body: JSON.stringify(`Queued ${Items.length} notifications`) };
  } catch (error) {
    console.error("Error:", error);
    throw new Error(`Failed to queue notifications: ${error.message}`);
  }
};