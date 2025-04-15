import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      window.location.href = "/products";
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center">
        Forgot your password?{" "}
        <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
          Reset it here
        </Link>
      </p>
      <p className="mt-2 text-center">
        Don’t have an account?{" "}
        <Link href="/auth/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
