import React, { useState, useEffect } from 'react';
import { useForm, usePage, Link, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';

const EditUser = ({ errors }) => {
  const { user, auth } = usePage().props; 
  
  const roleId = auth.user?.role_id;
  
  const roleOptions = [
      { value: 1, label: 'Super Admin' },
      { value: 2, label: 'Product Admin' },
      { value: 3, label: 'Investor' },
      { value: 4, label: 'Office Admin' },
      { value: 5, label: 'Hr' },
      { value: 6, label: 'Finance' }
  ];

  const cRoleOptions = [
      { value: 2, label: 'Product Admin' },
      { value: 3, label: 'Investor' },
      { value: 5, label: 'Hr' },
      { value: 6, label: 'Finance' }
  ];


  const { data, setData, put, processing } = useForm({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role_id: user.role_id,
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('users.update', { user: user.id })); 
  };

  const handleRoleChange = (selectedOption) => {
    setData('role_id', selectedOption ? selectedOption.value : '');
  };

  return (
    <Layout>
      <Head title="Edit user" />
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Edit User</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
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

          {/* Email Input */}
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

          {/* Phone Input */}
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

          {/* Role Select */}
          <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <Select
                  options={roleId === 1 ? roleOptions : cRoleOptions}
                  value={roleId === 1 ? roleOptions.find(option => option.value === data.role_id) : cRoleOptions.find(option => option.value === data.role_id)}
                  onChange={handleRoleChange}
                  className="mt-1 block w-full py-2"
                  placeholder="Select a role"
              />
              {errors.role_id && <div className="text-sm text-red-500 mt-1">{errors.role_id}</div>}
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
        <Link href={route('users.index')} className="mt-4 inline-block text-sm text-blue-600">Back to Users</Link>
      </div>
    </Layout>
  );
};

export default EditUser;
