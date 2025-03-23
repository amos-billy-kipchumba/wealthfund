import React from "react";
import { useForm, router } from "@inertiajs/react";
import { Link, Head } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";

const EditProduct = ({ product, errors }) => {
  const { data, setData, post, processing } = useForm({
    _method: 'PUT',
    name: product.name || "",
    amount: product.amount || "",
    days: product.days || "",
    payout: product.payout || "",
    logo: product.logo || null,
  });

  // Handle file input change
  const handleFileChange = (e) => {
    setData("logo", e.target.files[0]); // Only one file allowed
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append text fields
    Object.keys(data).forEach((key) => {
      if (key !== "logo") {
        formData.append(key, data[key]);
      }
    });

    // Append file field
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    // Send the request

    router.post(route('products.update', { product: product.id }), formData, {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  return (
    <Layout>
      <Head title="Edit Product" />
      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          
          {/* Name (Required) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.name && <div className="text-sm text-red-500 mt-1">{errors.name}</div>}
          </div>

          {/* Amount (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="text"
              value={data.amount}
              onChange={(e) => setData("amount", e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Days (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Days</label>
            <input
              type="number"
              value={data.days}
              onChange={(e) => setData("days", e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Payout (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Payout</label>
            <input
              type="text"
              value={data.payout}
              onChange={(e) => setData("payout", e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Logo Upload (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
            disabled={processing}
          >
            {processing ? "Saving..." : "Save"}
          </button>
        </form>
        
        <Link href={route("products.index")} className="mt-4 inline-block text-sm text-blue-600">
          Back to Products
        </Link>
      </div>
    </Layout>
  );
};

export default EditProduct;
