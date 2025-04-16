import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const reserved = ["besthubs@digisphere.co.za", "obe.dube@digisphere.co.za"];
    if (reserved.includes(email)) {
      setError("Email already exists");
      return;
    }
    // Simulate signup (in production, store in DynamoDB)
    router.push("/auth/signin");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#1a1a1a] text-[#d4af37]">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-[#2a2a2a] border border-[#d4af37]/20"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-[#2a2a2a] border border-[#d4af37]/20"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button type="submit" className="w-full p-2 bg-[#d4af37] text-[#1a1a1a]">
          Sign Up
        </button>
      </form>
      <p className="mt-4">
        Already have an account? <Link href="/auth/signin" className="underline">Sign In</Link>
      </p>
    </div>
  );
}
