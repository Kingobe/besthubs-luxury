import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

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
      case "POST":
        const { name, contactEmail, phone, address } = req.body;
        if (!name || !contactEmail) {
          return res.status(400).json({ error: "Name and contact email are required" });
        }
        const vendorId = randomUUID();
        const putCommand = new PutCommand({
          TableName: "Vendors",
          Item: {
            vendorId,
            name,
            contactEmail,
            phone: phone || "",
            address: address || "",
            createdAt: Date.now(),
          },
        });
        await docClient.send(putCommand);
        return res.status(201).json({ vendorId, name, contactEmail, phone, address });

      case "GET":
        const scanCommand = new ScanCommand({ TableName: "Vendors" });
        const { Items: vendors } = await docClient.send(scanCommand);
        return res.status(200).json(vendors || []);

      case "PUT":
        const { id: updateId, name: updateName, contactEmail: updateContactEmail, phone: updatePhone, address: updateAddress } = req.body;
        if (!updateId || !updateName || !updateContactEmail) {
          return res.status(400).json({ error: "ID, name, and contact email are required" });
        }
        const updateCommand = new UpdateCommand({
          TableName: "Vendors",
          Key: { vendorId: updateId },
          UpdateExpression: "set #name = :name, contactEmail = :contactEmail, phone = :phone, address = :address",
          ExpressionAttributeNames: { "#name": "name" },
          ExpressionAttributeValues: {
            ":name": updateName,
            ":contactEmail": updateContactEmail,
            ":phone": updatePhone || "",
            ":address": updateAddress || "",
          },
          ReturnValues: "ALL_NEW",
        });
        const { Attributes: updatedVendor } = await docClient.send(updateCommand);
        return res.status(200).json(updatedVendor);

      case "DELETE":
        const { id: deleteId } = req.query;
        if (!deleteId) {
          return res.status(400).json({ error: "Vendor ID is required" });
        }
        const deleteCommand = new DeleteCommand({
          TableName: "Vendors",
          Key: { vendorId: deleteId },
        });
        await docClient.send(deleteCommand);
        return res.status(200).json({ message: "Vendor deleted" });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Vendors API error:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
