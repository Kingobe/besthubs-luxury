import Busboy from "busboy";
import ExcelJS from "exceljs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
};

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-west-2",
  credentials,
});
const docClient = DynamoDBDocumentClient.from(client);

// Disable Next.js default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!req.headers["content-type"]?.includes("multipart/form-data")) {
    return res.status(400).json({ error: "Invalid content type" });
  }

  const busboy = Busboy({ headers: req.headers });
  let fileStream;

  busboy.on("file", (fieldname, file, info) => {
    const { filename, mimeType } = info; // Updated to match new busboy API
    if (!mimeType?.includes("spreadsheet")) {
      return res.status(400).json({ error: "Invalid file type. Please upload an Excel file (.xlsx, .xls)" });
    }
    fileStream = file;
  });

  busboy.on("finish", async () => {
    if (!fileStream) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const chunks = [];
    for await (const chunk of fileStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];
    const data = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      data.push({
        productId: row.getCell(1).value?.toString(),
        stock: row.getCell(2).value,
        imageUrl: row.getCell(3).value?.toString(),
      });
    });

    for (const row of data) {
      const { productId, stock, imageUrl } = row;
      if (productId && (stock != null || imageUrl)) {
        try {
          const updateExpression = [];
          const expressionAttributeValues = {};

          if (stock != null) {
            updateExpression.push("stock = :stock");
            expressionAttributeValues[":stock"] = parseInt(stock);
          }
          if (imageUrl) {
            updateExpression.push("imageUrl = :imageUrl");
            expressionAttributeValues[":imageUrl"] = imageUrl;
          }

          if (updateExpression.length === 0) continue;

          const updateCommand = new UpdateCommand({
            TableName: "Products",
            Key: { productId },
            UpdateExpression: `set ${updateExpression.join(", ")}`,
            ExpressionAttributeValues: expressionAttributeValues,
          });
          await docClient.send(updateCommand);
          console.log(`Updated productId: ${productId}, stock: ${stock}, imageUrl: ${imageUrl}`);
        } catch (error) {
          console.error(`Failed to update productId: ${productId}`, error);
        }
      }
    }

    res.status(200).json({ message: "Stock and images updated successfully" });
  });

  busboy.on("error", (error) => {
    console.error("Busboy error:", error);
    res.status(500).json({ error: "Failed to process file upload" });
  });

  req.pipe(busboy);
}
