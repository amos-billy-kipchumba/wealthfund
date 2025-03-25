import React, { useState } from 'react';
import { Link, Head, useForm, usePage } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';
import { Check, XCircle } from 'lucide-react';

const Show = ({ investor, user, product }) => {

    const { auth } = usePage().props;

  const roleId = auth.user?.role_id;
const userPermission = auth.user?.permissions?.map(perm => perm?.name) || [];

  const { processing } = useForm({
    approved: ''
  });

  const [previews] = useState({
      id_front: investor?.id_front ? `/storage/${investor?.id_front}` : null,
      id_back: investor?.id_back ? `/storage/${investor?.id_back}` : null,
      passport_front: investor?.passport_front ? `/storage/${investor?.passport_front}` : null
  });

  const handleDelete = (investorId) => {
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
        router.delete(route('investors.destroy', investorId));
      }
    });
  };

  const handleApprovedUpdate = (e, id, approved) => {
    e.preventDefault();
    
    const formData = {
      _method: 'PUT', 
      approved: approved,
      id: id
    };
  
    Swal.fire({
      title: `Are you sure you want to ${approved.toLowerCase()} this investor?`,
      text: 'This action will update the investor approved.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: approved === 'Approved' ? '#3085d6' : '#d33',
      cancelButtonColor: '#gray',
      confirmButtonText: `Yes, ${approved.toLowerCase()} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('investors.update', id), formData, {
          onSuccess: () => {
            Swal.fire(
              `${approved}!`, 
              `The Investor has been ${approved.toLowerCase()}.`, 
              'success'
            );
          },
          onError: (err) => {
            console.error(`${approved} error:`, err);
            Swal.fire('Error', 'There was a problem updating the investor approval.', 'error');
          }
        });
      }
    });
  };

  return (
    <Layout>
      <Head title={user?.name} />
      <div className="max-w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Investor Details</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4 card">
            {previews.passport_front && (
                <div className="card relative flex flex-col">
                    <img
                        src={previews.passport_front}
                        alt="ID Front"
                        className="w-full h-[20vh] object-cover rounded-md"
                    />
                    <p>Passport photo</p>
                </div>
            )}
            <div className="flex justify-between">
              <strong className="text-gray-600">Name:</strong> 
              <span className="text-gray-800">{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">Salary:</strong> 
              <span className="text-gray-800">{investor.salary}</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">Asset limit:</strong> 
              <span className="text-gray-800">{investor.asset_limit}</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">Email:</strong> 
              <span className="text-gray-800">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">Phone:</strong> 
              <span className="text-gray-800">{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">ID number:</strong> 
              <span className="text-gray-800">{investor.id_number}</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">Approved:</strong> 
              <span className="text-gray-800">{investor.approved}</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">Unpaid assets:</strong> 
              <span className="text-gray-800">{investor.unpaid_assets_count}</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-gray-600">Total asset balance:</strong> 
              <span className="text-gray-800">{investor.total_asset_balance}</span>
            </div>
          </div>

          <div className="card">
              <div className="flex flex-col lg:flex-row gap-4">
                  {previews.id_front && (
                      <div className="card relative flex flex-col">
                          <img
                              src={previews.id_front}
                              alt="ID Front"
                              className="w-full h-[20vh] object-cover rounded-md"
                          />
                          <p>ID front</p>
                      </div>
                  )}
                  {previews.id_back && (
                      <div className="card relative flex flex-col">
                          <img
                              src={previews.id_back}
                              alt="ID Back"
                              className="w-full h-[20vh] object-cover rounded-md"
                          />
                          <p>ID back</p>
                      </div>
                  )}
              </div>
          </div>
        </div>

        <div className="mt-8 text-left flex gap-4">
          {userPermission.includes('Index investor') &&
          <Link 
            href={route('investors.index')} 
            className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            Back to Investors
          </Link>}

          {userPermission.includes('Edit investor') &&
          <Link 
            href={route('investors.edit', investor.id)} 
            className="flex items-center bg-yellow-500 text-white rounded-lg text-xs hover:bg-yellow-600"
          >
            <span className="my-auto px-4 py-2">Edit</span>
          </Link>}

          {userPermission.includes('Delete investor') &&
          <button
            onClick={() => handleDelete(investor.id)}
            className="flex items-center cursor-pointer bg-red-600 text-white rounded-lg text-xs hover:bg-red-700"
          >
            <span className="my-auto px-4 py-2">Delete</span> 
          </button>}
          
          {investor.salary &&
          <>
          {(investor.approved !== 'Approved' && userPermission.includes('Edit asset')) &&
            <button
              onClick={(e) => handleApprovedUpdate(e, investor.id, 'Approved')}
              disabled={processing}
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-2" /> Approve
            </button>}

            {(investor?.user?.status !== 'Deactivated' && userPermission.includes('Delete asset')) &&
            <button
              onClick={(e) => handleApprovedUpdate(e, investor.id, 'Deactivated')}
              disabled={processing}
              className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-2" /> Deactivate
            </button>}

          {(investor.approved !== 'Declined' && userPermission.includes('Edit asset')) &&
          <button
            onClick={(e) => handleApprovedUpdate(e, investor.id, 'Declined')}
            disabled={processing}
            className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4 mr-2" /> Decline
          </button>}
          </>}
        </div>
      </div>
    </Layout>
  );
};

export default Show;
