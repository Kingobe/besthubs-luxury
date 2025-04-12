import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/profile");
    }
  };

  return (
    <div style={{ fontFamily: "'Playfair Display', serif", color: "#d4af37" }}>
      <header style={{ background: "#1a1a1a", color: "#d4af37", padding: "20px", textAlign: "center" }}>
        <h1>Sign In</h1>
        <nav>
          <a href="/" style={{ color: "#d4af37", margin: "0 10px", textDecoration: "none" }}>Home</a>
          <a href="/auth/signup" style={{ color: "#d4af37", margin: "0 10px", textDecoration: "none" }}>Sign Up</a>
        </nav>
      </header>
      <div style={{ background: "#2c2c2c", padding: "40px", minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
          <h2 style={{ marginBottom: "20px" }}>Sign In to Your Account</h2>
          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
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
            Sign In
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