import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import crypto from "crypto";

// Use environment variables directly
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
};

// Log credentials for debugging
console.log("Using AWS credentials:", {
  accessKeyId: credentials.accessKeyId,
  secretAccessKey: credentials.secretAccessKey ? "[REDACTED]" : undefined,
  sessionToken: credentials.sessionToken,
  region: process.env.AWS_REGION || "us-west-2",
});

if (!credentials.accessKeyId || !credentials.secretAccessKey) {
  throw new Error("AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in environment variables");
}

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-west-2",
  credentials,
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-west-2",
  credentials,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const getCommand = new GetCommand({
      TableName: "Users",
      Key: { email },
    });
    const { Item: user } = await docClient.send(getCommand);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 3600000;

    const putCommand = new PutCommand({
      TableName: "Users",
      Item: {
        ...user,
        resetToken: token,
        resetTokenExpires: expires,
      },
    });
    await docClient.send(putCommand);

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${email}`;

    const sendEmailCommand = new SendEmailCommand({
      Source: "besthubs@digisphere.co.za",
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "Password Reset Request" },
        Body: {
          Text: { Data: `Click here to reset your password: ${resetLink}` },
          Html: { Data: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>` },
        },
      },
    });
    await sesClient.send(sendEmailCommand);
    console.log(`Password reset email sent to ${email}`);

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ error: "Failed to process request", details: error.message });
  }
}
