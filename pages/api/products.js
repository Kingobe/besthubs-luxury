import clientPromise from "../../lib/mongodb";
export default async function handler(req, res) {
try {
const client = await clientPromise;
const db = client.db("besthubs");
const collection = db.collection("products");

switch (req.method) {
case "GET":
const products = await collection.find({}).toArray();
return res.status(200).json(products);

case "PUT":
await collection.insertOne(req.body);
return res.status(200).json({ message: "Product added" });

default:
return res.status(405).json({ error: "Method not allowed" });
}
} catch (error) {
console.error("Products API error:", error);
return res.status(500).json({ error: error.message });
}
}
