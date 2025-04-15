const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

async function getUser(email) {
  const command = new GetCommand({
    TableName: "Users",
    Key: { email },
    ConsistentRead: true,
  });
  const { Item } = await docClient.send(command);
  console.log("User:", Item);
}

getUser("digisphere.obe@gmail.com").catch(console.error);
