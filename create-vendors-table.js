const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function createVendorsTable() {
  const command = new CreateTableCommand({
    TableName: "Vendors",
    AttributeDefinitions: [
      { AttributeName: "vendorId", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "vendorId", KeyType: "HASH" },
    ],
    BillingMode: "PAY_PER_REQUEST",
  });

  try {
    await client.send(command);
    console.log("Vendors table created successfully");
  } catch (error) {
    console.error("Error creating Vendors table:", error);
  }
}

createVendorsTable();
