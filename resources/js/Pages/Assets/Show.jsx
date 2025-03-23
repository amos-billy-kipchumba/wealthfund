import React from 'react';
import { Link, usePage, Head, useForm } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';

const Show = ({ asset }) => {

  const { auth } = usePage().props;
    const roleId = auth.user?.role_id;
      const { delete: destroy } = useForm();

  const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];



    const handleDelete = (assetId) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          // Use Inertia.delete for making the delete request
          destroy(route('assets.destroy', assetId), {
            onSuccess: () => {
              // Optionally you can handle success actions here
            },
            onError: (err) => {
              console.error('Delete error:', err);
            },
          });
        }
      });
    };

  return (
    <Layout>
      <Head title={asset.number} />
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Asset Details</h1>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <strong className="text-gray-600">Asset Number:</strong> 
            <span className="text-gray-800">{asset.number}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Name:</strong> 
            <span className="text-gray-800">{asset.investor?.user?.name}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Principle:</strong> 
            <span className="text-gray-800">  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(asset.amount - asset.charges)}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Charges:</strong> 
            <span className="text-gray-800">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(asset.charges)}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Current balance:</strong> 
            <span className="text-gray-800">  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(asset.currentBalance)}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Asset due:</strong> 
            <span className="text-gray-800">  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(asset.amount)}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Status:</strong> 
            <span className="text-gray-800">{asset.status}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Asset Provider:</strong> 
            <span className="text-gray-800">{asset.asset_provider?.name}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Email:</strong> 
            <span className="text-gray-800">{asset.investor?.user?.email}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Phone:</strong> 
            <span className="text-gray-800">{asset.investor?.user?.phone}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          {userPermission.includes('Index asset') &&
         <Link 
            href={route('assets.index')} 
            className="inline-block px-6 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            Back to Assets
          </Link>}
          {userPermission.includes('Edit asset') &&
            <Link
              href={route('assets.edit', asset.id)}
              className="inline-flex items-center px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
            >
              Edit
            </Link>}
            {userPermission.includes('Delete asset') &&
            <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDelete(asset.id); 
                }}
                className="inline"
              >
                <button type="submit" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
                  Delete
                </button>

            </form>}
      
          {((asset.status === 'Pending' || asset.status === 'Declined') && userPermission.includes('Edit asset')) && (
            <Link
              href={route('assets.approval', asset.id)}
              className="inline-flex items-center px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
            >
              Process advance
            </Link>)}
        </div>
      </div>
    </Layout>
  );
};

export default Show;
