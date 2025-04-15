import { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { name, price, description, stock };
    if (editingId) {
      body.id = editingId;
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setEditingId(null);
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setName("");
    setPrice("");
    setDescription("");
    setStock("");
    fetchProducts();
  };

  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setStock(product.stock || "");
    setEditingId(product.productId);
  };

  const handleDelete = async (productId) => {
    await fetch(`/api/products?id=${productId}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Luxury Products</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            id="stock"
            placeholder="Enter stock quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.productId}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
          >
            <div>
              <span className="font-semibold text-gray-800">{product.name}</span> - ${product.price} -{" "}
              <span className="text-gray-600">{product.description}</span> -{" "}
              <span className="text-gray-600">Stock: {product.stock || "N/A"}</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.productId)}
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
