import { useState } from "react";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const dynamoClient = new DynamoDBClient({ region: "af-south-1" });
const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check if user already exists
    const { Item } = await dynamoDB.send(
      new GetCommand({
        TableName: "Users",
        Key: { email },
      })
    );

    if (Item) {
      setError("User with this email already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the user in DynamoDB
    await dynamoDB.send(
      new PutCommand({
        TableName: "Users",
        Item: {
          email,
          password: hashedPassword,
          isAdmin: email === "besthubs@digisphere.co.za", // Mark this email as admin
        },
      })
    );

    setSuccess("Account created successfully! You can now sign in.");
    setEmail("");
    setPassword("");
  };

  return (
    <div style={{ fontFamily: "'Playfair Display', serif", color: "#d4af37" }}>
      <header style={{ background: "#1a1a1a", color: "#d4af37", padding: "20px", textAlign: "center" }}>
        <h1>Sign Up</h1>
        <nav>
          <a href="/" style={{ color: "#d4af37", margin: "0 10px", textDecoration: "none" }}>Home</a>
          <a href="/auth/signin" style={{ color: "#d4af37", margin: "0 10px", textDecoration: "none" }}>Sign In</a>
        </nav>
      </header>
      <div style={{ background: "#2c2c2c", padding: "40px", minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
          <h2 style={{ marginBottom: "20px" }}>Create an Account</h2>
          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
          {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #d4af37", background: "#3a3a3a", color: "#d4af37" }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #d4af37", background: "#3a3a3a", color: "#d4af37" }}
            />
          </div>
          <button
            type="submit"
            style={{ background: "#d4af37", color: "#1a1a1a", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Sign Up
          </button>
        </form>
      </div>
      <footer style={{ background: "#1a1a1a", color: "#d4af37", padding: "20px", textAlign: "center" }}>
        <p>© 2025 Best Hubs</p>
        <p>Pine Park, Linden, Johannesburg, 2194</p>
      </footer>
    </div>
  );
}