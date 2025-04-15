import { useState } from "react";
import { useSession } from "next-auth/react";

export default function UploadStock() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!session) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">Please sign in to access this page.</div>;
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-stock", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setError("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to upload stock");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Stock Data</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload Excel File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
