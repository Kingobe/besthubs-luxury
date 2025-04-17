require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

async function seed() {
const uri = process.env.MONGODB_URI;
if (!uri) {
throw new Error("MONGODB_URI is not defined in .env.local");
}
const client = new MongoClient(uri);
try {
await client.connect();
console.log("Connected to MongoDB");
const db = client.db("besthubs");
const users = db.collection("users");
const products = db.collection("products");
await users.deleteMany({});
await products.deleteMany({});
await users.insertOne({
email: "obe.dube@digisphere.co.za",
password: await bcrypt.hash("test1234", 10),
isAdmin: true,
});
await products.insertMany([
{ name: "Classic Mint", price: 100 },
{ name: "Strawberry Bliss", price: 120 },
]);
console.log("Seeded users and products");
} catch (error) {
console.error("Seeding error:", error);
} finally {
await client.close();
}
}
seed().catch(console.error);
