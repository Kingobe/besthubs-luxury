import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    signOut({ redirect: false }).then(() => {
      router.push("/");
    });
  }, [router]);

  return (
    <div style={{ fontFamily: "'Playfair Display', serif", color: "#d4af37" }}>
      <header style={{ background: "#1a1a1a", color: "#d4af37", padding: "20px", textAlign: "center" }}>
        <h1>Signing Out...</h1>
      </header>
      <div style={{ background: "#2c2c2c", padding: "40px", minHeight: "80vh", textAlign: "center" }}>
        <p>You are being signed out. Please wait...</p>
      </div>
      <footer style={{ background: "#1a1a1a", color: "#d4af37", padding: "20px", textAlign: "center" }}>
        <p>© 2025 Best Hubs</p>
        <p>Pine Park, Linden, Johannesburg, 2194</p>
      </footer>
    </div>
  );
}