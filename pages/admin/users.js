import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Users() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { email, password, isAdmin };
    if (editingId) {
      body.id = editingId;
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setEditingId(null);
    } else {
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setEmail("");
    setPassword("");
    setIsAdmin(false);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEmail(user.email);
    setPassword("");
    setIsAdmin(user.isAdmin);
    setEditingId(user.email);
  };

  const handleDelete = async (email) => {
    await fetch(`/api/users?email=${email}`, { method: "DELETE" });
    fetchUsers();
  };

  if (!session || !session.user.isAdmin) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">Access denied. Admins only.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Users</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">{editingId ? "New Password (leave blank to keep unchanged)" : "Password"}</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!editingId}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isAdmin" className="block text-sm font-medium text-gray-700">Admin Status</label>
          <input
            type="checkbox"
            id="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {editingId ? "Update User" : "Add User"}
        </button>
      </form>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.email}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
          >
            <div>
              <span className="font-semibold text-gray-800">{user.email}</span> -{" "}
              <span className="text-gray-600">Admin: {user.isAdmin ? "Yes" : "No"}</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.email)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
