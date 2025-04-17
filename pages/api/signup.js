import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

const { email, password } = req.body;
if (!email || !password) {
return res.status(400).json({ error: "Email and password are required" });
}

try {
const client = await clientPromise;
const db = client.db("besthubs");
const existingUser = await db.collection("users").findOne({ email });
if (existingUser) {
return res.status(409).json({ error: "User already exists" });
}
const hashedPassword = await bcrypt.hash(password, 10);
await db.collection("users").insertOne({
email,
password: hashedPassword,
isAdmin: email === "obe.dube@digisphere.co.za" ? true : false,
});
return res.status(201).json({ message: "User created" });
} catch (error) {
console.error("Signup error:", error);
return res.status(500).json({ error: "Signup failed" });
}
}
