import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { id: session.user.email, email, password, isAdmin: session.user.isAdmin };
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully");
        setError("");
      } else {
        setError(data.error);
        setMessage("");
      }
    } catch (err) {
      setError("Failed to update profile");
      setMessage("");
    }
  };

  if (!session) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">Please sign in to access this page.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Manage Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password (leave blank to keep unchanged)</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
