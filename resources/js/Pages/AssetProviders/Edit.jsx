import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Link, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";

const EditAssetProvider = ({ assetProvider, errors }) => {
  const { data, setData, put, processing } = useForm({
    name: assetProvider.name,
    api_url: assetProvider.api_url,
    email: assetProvider.email,
    phone: assetProvider.phone,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('assetProviders.update', { assetProvider: assetProvider.id }));
  };

  return (
    <Layout>
      <Head title="Edit provider" />
      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1>Edit asset provider</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <div className="text-sm text-red-500 mt-1">{errors.name}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Api_url</label>
            <input
              type="text"
              value={data.api_url}
              onChange={(e) => setData('api_url', e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.api_url && <div className="text-sm text-red-500 mt-1">{errors.api_url}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <div className="text-sm text-red-500 mt-1">{errors.email}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.phone && <div className="text-sm text-red-500 mt-1">{errors.phone}</div>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={processing}
          >
            {processing ? 'Saving...' : 'Save'}
          </button>
        </form>
        <Link href={route('assetProviders.index')} className="mt-4 inline-block text-sm text-blue-600">Back to asset providers</Link>
      </div>
    </Layout>
  );
};

export default EditAssetProvider;
