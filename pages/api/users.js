import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
};

console.log("Using AWS credentials:", {
  accessKeyId: credentials.accessKeyId,
  secretAccessKey: credentials.secretAccessKey ? "[REDACTED]" : undefined,
  sessionToken: credentials.sessionToken,
  region: process.env.AWS_REGION || "us-west-2",
});

if (!credentials.accessKeyId || !credentials.secretAccessKey) {
  throw new Error("AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in environment variables");
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-west-2",
  credentials,
});
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const scanCommand = new ScanCommand({ TableName: "Users" });
        const { Items: users } = await docClient.send(scanCommand);
        return res.status(200).json(users || []);

      case "PUT":
        const { id: updateId, email: updateEmail, password: updatePassword, isAdmin: updateIsAdmin } = req.body;
        if (!updateId || !updateEmail) {
          return res.status(400).json({ error: "ID and email are required" });
        }
        const updateExpression = ["email = :email", "isAdmin = :isAdmin"];
        const expressionAttributeValues = {
          ":email": updateEmail,
          ":isAdmin": updateIsAdmin || false,
        };
        if (updatePassword) {
          const hashedPassword = await bcrypt.hash(updatePassword, 10);
          updateExpression.push("password = :password");
          expressionAttributeValues[":password"] = hashedPassword;
        }
        const updateCommand = new UpdateCommand({
          TableName: "Users",
          Key: { email: updateId },
          UpdateExpression: `set ${updateExpression.join(", ")}`,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW",
        });
        const { Attributes: updatedUser } = await docClient.send(updateCommand);
        return res.status(200).json(updatedUser);

      case "DELETE":
        const { email: deleteEmail } = req.query;
        if (!deleteEmail) {
          return res.status(400).json({ error: "Email is required" });
        }
        const deleteCommand = new DeleteCommand({
          TableName: "Users",
          Key: { email: deleteEmail },
        });
        await docClient.send(deleteCommand);
        return res.status(200).json({ message: "User deleted" });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Users API error:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
