import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, token, password } = req.body;
  if (!email || !token || !password) {
    return res.status(400).json({ error: "Email, token, and password are required" });
  }

  try {
    // Get user and verify token
    const getCommand = new GetCommand({
      TableName: "Users",
      Key: { email },
    });
    const { Item: user } = await docClient.send(getCommand);

    if (!user || user.resetToken !== token || user.resetTokenExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    const putCommand = new PutCommand({
      TableName: "Users",
      Item: {
        ...user,
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });
    await docClient.send(putCommand);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ error: "Failed to reset password" });
  }
}
