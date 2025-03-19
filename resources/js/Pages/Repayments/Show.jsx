import React from 'react';
import { Link, Head, useForm, usePage } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';

const Show = ({ repayment }) => {
  const { auth } = usePage().props;
    const {
      delete: destroy,
    } = useForm();

    const roleId = auth.user?.role_id;

  const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];


    const handleDelete = (repaymentId) => {
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
          destroy(route('repayments.destroy', repaymentId), {
            onSuccess: () => {
              // Optionally you can handle success actions here
            },
            onError: (err) => {
              // Optionally handle errors
              console.error('Delete error:', err);
            },
          });
        }
      });
    };
  
  return (
    <Layout>
      <Head title={repayment.number} />
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Repayment Details</h1>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <strong className="text-gray-600">Repayment Number:</strong>
            <span className="text-gray-800">{repayment.number}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Employee Name:</strong>
            <span className="text-gray-800">{repayment?.loan?.employee?.user?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Company Name:</strong>
            <span className="text-gray-800">{repayment?.loan?.employee?.company?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Loan Amount:</strong>
            <span className="text-gray-800">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(repayment?.loan?.amount)}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Repayment Amount:</strong>
            <span className="text-gray-800">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(repayment.amount)}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Company Phone:</strong>
            <span className="text-gray-800">{repayment?.loan?.employee?.company?.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Company Email:</strong>
            <span className="text-gray-800">{repayment?.loan?.employee?.company?.email || 'N/A'}</span>
          </div>
        </div>

        <div className="mt-8 text-left flex gap-4">
          {userPermission.includes('Index repayment') && 
          <Link 
            href={route('repayments.index')} 
            className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            Back to Repayments
          </Link>}

          {userPermission.includes('Edit repayment') &&
            <Link
              href={route('repayments.edit', repayment.id)}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
            >
              Edit
            </Link>}
            {userPermission.includes('Delete repayment') &&
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDelete(repayment.id); // Call SweetAlert2 on delete
              }}
              className="inline"
            >
              <button type="submit" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
                Delete
              </button>
            </form>}
          
        </div>
      </div>
    </Layout>
  );
};

export default Show;
