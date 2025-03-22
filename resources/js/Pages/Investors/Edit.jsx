import React, { useState, useEffect } from 'react';
import { useForm, usePage, Link, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';

const EditInvestor = ({ errors }) => {
  const { products, investor, users, auth } = usePage().props; 
  const roleId = auth.user?.role_id;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, setData, put, processing } = useForm({
    salary: investor.salary,
    asset_limit: selectedProduct 
      ? Number((investor.salary * selectedProduct.asset_limit / 100).toFixed(2)) 
      : 0, 
    user_id: investor.user_id,
    product_id: roleId === 2 ? auth.user?.product_id ?? '' : '',
    approved: investor.approved ?? '', 
  });
  

  useEffect(() => {
    if (investor.product_id) {
      const defaultProduct = products.find((c) => c.id === investor?.product_id);
      setSelectedProduct(defaultProduct);
    }

    if (investor.user_id) {
      const defaultUser = users.find((c) => c.id === investor?.user_id);
      setSelectedUser(defaultUser);
    }
  }, [investor, products, users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('investors.update', { investor: investor.id })); 
  };

  const handleProductChange = (selectedOption) => {
    setData('product_id', selectedOption ? selectedOption.value : '');
    setSelectedProduct(selectedOption);
  };

  const handleUserChange = (selectedOption) => {
    setData('user_id', selectedOption ? selectedOption.value : '');
    setSelectedUser(selectedOption);
  };

  const handleApprovalChange = (e) => {
    setData('approved', e.target.value);
  };

  return (
    <Layout>
      <Head title="Edit investor" />
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Edit Investor Details And Approved</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
              <label className="block text-sm font-medium text-gray-700">Net Salary</label>
              <input
                  type="number"
                  step="any"
                  value={data.salary}
                  onChange={(e) => {
                      const salary = parseFloat(e.target.value) || 0;
                      setData({
                          ...data,
                          salary: salary,
                          asset_limit: selectedProduct 
                          ? Number((salary * selectedProduct.asset_limit / 100).toFixed(2)) 
                          : 0, 
                      });
                  }}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.salary && <div className="text-sm text-red-500 mt-1">{errors.salary}</div>}
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700">Asset Limit (67% of Salary)</label>
              <input
                  type="number"
                  value={data.asset_limit}
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none"
              />
          </div>

          {roleId === 1 &&
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <Select
              value={selectedProduct}
              onChange={handleProductChange}
              className='outline-none'
              options={products.map((product) => ({
                value: product.id,
                label: product.name
              }))}
              placeholder="Select a product"
            />
            {errors.product_id && <div className="text-sm text-red-500 mt-1">{errors.product_id}</div>}
          </div>}

          {roleId === 1 &&
          <div>
            <label className="block text-sm font-medium text-gray-700">User</label>
            <Select
              value={selectedUser}
              onChange={handleUserChange}
              options={users.map((user) => ({
                value: user.id,
                label: user.name
              }))}
              placeholder="Select a user"
            />
            {errors.user_id && <div className="text-sm text-red-500 mt-1">{errors.user_id}</div>}
          </div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Approved</label>
            <select
              value={data.approved}
              onChange={handleApprovalChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select approval...</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
            {errors.approved && <div className="text-sm text-red-500 mt-1">{errors.approved}</div>}
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={processing}
          >
            {processing ? 'Saving...' : 'Save'}
          </button>
        </form>
        <Link href={route('investors.index')} className="mt-4 inline-block text-sm text-blue-600">Back to Investors</Link>
      </div>
    </Layout>
  );
};

export default EditInvestor;
