import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError("Invalid email or password");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#1a1a1a] text-[#d4af37]">
      <h1 className="text-2xl mb-4">Sign In</h1>
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
          Sign In
        </button>
      </form>
      <p className="mt-4">
        Need an account? <Link href="/auth/signup" className="underline">Sign Up</Link>
      </p>
    </div>
  );
}
