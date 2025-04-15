import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
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
        const { name, price, description, stock } = req.body;
        if (!name || !price) {
          return res.status(400).json({ error: "Name and price are required" });
        }
        const productId = randomUUID();
        const putCommand = new PutCommand({
          TableName: "Products",
          Item: {
            productId,
            name,
            price: parseFloat(price),
            description: description || "",
            stock: stock ? parseInt(stock) : 0,
            createdAt: Date.now(),
          },
        });
        await docClient.send(putCommand);
        return res.status(201).json({ productId, name, price, description, stock });

      case "GET":
        const scanCommand = new ScanCommand({ TableName: "Products" });
        const { Items: products } = await docClient.send(scanCommand);
        return res.status(200).json(products || []);

      case "PUT":
        const { id: updateId, name: updateName, price: updatePrice, description: updateDescription, stock: updateStock } = req.body;
        if (!updateId || !updateName || !updatePrice) {
          return res.status(400).json({ error: "ID, name, and price are required" });
        }
        const updateCommand = new UpdateCommand({
          TableName: "Products",
          Key: { productId: updateId },
          UpdateExpression: "set #name = :name, price = :price, description = :description, stock = :stock",
          ExpressionAttributeNames: { "#name": "name" },
          ExpressionAttributeValues: {
            ":name": updateName,
            ":price": parseFloat(updatePrice),
            ":description": updateDescription || "",
            ":stock": updateStock ? parseInt(updateStock) : 0,
          },
          ReturnValues: "ALL_NEW",
        });
        const { Attributes: updatedProduct } = await docClient.send(updateCommand);
        return res.status(200).json(updatedProduct);

      case "DELETE":
        const { id: deleteId } = req.query;
        if (!deleteId || deleteId === "undefined") {
          return res.status(400).json({ error: "Product ID is required" });
        }
        const deleteCommand = new DeleteCommand({
          TableName: "Products",
          Key: { productId: deleteId },
        });
        await docClient.send(deleteCommand);
        return res.status(200).json({ message: "Product deleted" });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Products API error:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
