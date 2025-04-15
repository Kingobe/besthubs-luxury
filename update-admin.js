const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

async function updateAdmin(email) {
  const command = new UpdateCommand({
    TableName: "Users",
    Key: { email },
    UpdateExpression: "set isAdmin = :isAdmin",
    ExpressionAttributeValues: {
      ":isAdmin": true,
    },
  });
  await docClient.send(command);
  console.log(`Updated ${email} to admin`);
}

updateAdmin("digisphere.obe@gmail.com").catch(console.error);
