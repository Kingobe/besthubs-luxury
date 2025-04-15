import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Form submitted with email:", email, "and password:", password);
    const payload = { email, password };
    console.log("Payload being sent:", payload);
    try {
      console.log("Attempting to fetch /api/signup");
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      console.log("Fetch response status:", res.status);
      const data = await res.json();
      console.log("Fetch response data:", data);
      if (!res.ok) {
        console.log("Fetch failed with status:", res.status, "and data:", data);
        throw new Error(data.error || "Failed to create account");
      }
      console.log("Signup successful, redirecting to signin");
      router.push("/auth/signin");
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to create account");
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
