import { useRouter } from "next/router";

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div style={{ fontFamily: "'Playfair Display', serif", color: "#d4af37" }}>
      <header style={{ background: "#1a1a1a", color: "#d4af37", padding: "20px", textAlign: "center" }}>
        <h1>Error</h1>
        <nav>
          <a href="/" style={{ color: "#d4af37", margin: "0 10px", textDecoration: "none" }}>Home</a>
          <a href="/auth/signin" style={{ color: "#d4af37", margin: "0 10px", textDecoration: "none" }}>Sign In</a>
        </nav>
      </header>
      <div style={{ background: "#2c2c2c", padding: "40px", minHeight: "80vh", textAlign: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>Authentication Error</h2>
        <p style={{ color: "red" }}>{error || "An unknown error occurred"}</p>
        <p>Please try signing in again or contact support if the issue persists.</p>
      </div>
      <footer style={{ background: "#1a1a1a", color: "#d4af37", padding: "20px", textAlign: "center" }}>
        <p>© 2025 Best Hubs</p>
        <p>Pine Park, Linden, Johannesburg, 2194</p>
      </footer>
    </div>
  );
}