import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Vendors() {
  const { data: session } = useSession();
  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchVendors = async () => {
    const res = await fetch("/api/vendors");
    const data = await res.json();
    setVendors(data);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { name, contactEmail, phone, address };
    if (editingId) {
      body.id = editingId;
      await fetch("/api/vendors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setEditingId(null);
    } else {
      await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setName("");
    setContactEmail("");
    setPhone("");
    setAddress("");
    fetchVendors();
  };

  const handleEdit = (vendor) => {
    setName(vendor.name);
    setContactEmail(vendor.contactEmail);
    setPhone(vendor.phone);
    setAddress(vendor.address);
    setEditingId(vendor.vendorId);
  };

  const handleDelete = async (vendorId) => {
    await fetch(`/api/vendors?id=${vendorId}`, { method: "DELETE" });
    fetchVendors();
  };

  if (!session) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">Please sign in to access this page.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Vendors</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Vendor Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter vendor name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            id="contactEmail"
            placeholder="Enter contact email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            id="phone"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {editingId ? "Update Vendor" : "Add Vendor"}
        </button>
      </form>
      <ul className="space-y-4">
        {vendors.map((vendor) => (
          <li
            key={vendor.vendorId}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
          >
            <div>
              <span className="font-semibold text-gray-800">{vendor.name}</span> -{" "}
              <span className="text-gray-600">{vendor.contactEmail}</span> -{" "}
              <span className="text-gray-600">{vendor.phone || "N/A"}</span> -{" "}
              <span className="text-gray-600">{vendor.address || "N/A"}</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(vendor)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(vendor.vendorId)}
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
