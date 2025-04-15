import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
};

if (!credentials.accessKeyId || !credentials.secretAccessKey) {
  throw new Error("AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in environment variables");
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-west-2",
  credentials,
});
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, isAdmin } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const putCommand = new PutCommand({
      TableName: "Users",
      Item: {
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
        createdAt: Date.now(),
      },
      ConditionExpression: "attribute_not_exists(email)",
    });

    await docClient.send(putCommand);
    console.log(`User successfully added to DynamoDB: ${email}`);
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.name === "ConditionalCheckFailedException") {
      return res.status(400).json({ error: "User already exists" });
    }
    return res.status(500).json({ error: "Failed to create user" });
  }
}
