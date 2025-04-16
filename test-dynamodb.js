const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: "AKIASNEGCBFCFD77MPGP",
    secretAccessKey: "vyo/G0wRaUb8VZCtbQ8qt9MmBveCl942m1sobGQ"
  }
});
async function scanUsers() {
  try {
    const command = new ScanCommand({ TableName: "Users" });
    const response = await client.send(command);
    console.log(JSON.stringify(response.Items, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}
scanUsers();
