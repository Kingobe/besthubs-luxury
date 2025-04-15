const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");

const client = new DynamoDBClient({
  region: "us-west-2",
  credentials: fromIni({ profile: "default" }),
});
const docClient = DynamoDBDocumentClient.from(client);

async function testScan() {
  try {
    const scanCommand = new ScanCommand({ TableName: "Products" });
    const { Items: products } = await docClient.send(scanCommand);
    console.log("Products:", products);
  } catch (error) {
    console.error("Test error:", error);
  }
}

testScan();
