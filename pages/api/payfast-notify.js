import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { payment_status, m_payment_id } = req.body;
  if (payment_status === "COMPLETE") {
    try {
      await docClient.send(new UpdateCommand({
        TableName: "Orders",
        Key: { orderId: m_payment_id },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": "rented" },
      }));
      res.status(200).json({ message: "Order updated" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  } else {
    res.status(200).json({ message: "Payment not complete" });
  }
}
