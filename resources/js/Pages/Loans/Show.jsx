import React from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';

const Show = ({ loan }) => {

  const { auth } = usePage().props;
    const roleId = auth.user?.role_id;

  const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];



    const handleDelete = (loanId) => {
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
          destroy(route('loans.destroy', loanId), {
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
      <Head title={loan.number} />
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Salary Advance Details</h1>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <strong className="text-gray-600">Salary advance Number:</strong> 
            <span className="text-gray-800">{loan.number}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Name:</strong> 
            <span className="text-gray-800">{loan.employee?.user?.name}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Principle:</strong> 
            <span className="text-gray-800">  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(loan.amount - loan.charges)}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Charges:</strong> 
            <span className="text-gray-800">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(loan.charges)}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Current balance:</strong> 
            <span className="text-gray-800">  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(loan.currentBalance)}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Loan due:</strong> 
            <span className="text-gray-800">  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(loan.amount)}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Status:</strong> 
            <span className="text-gray-800">{loan.status}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Loan Provider:</strong> 
            <span className="text-gray-800">{loan.loan_provider?.name}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Email:</strong> 
            <span className="text-gray-800">{loan.employee?.user?.email}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Phone:</strong> 
            <span className="text-gray-800">{loan.employee?.user?.phone}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          {userPermission.includes('Index loan') &&
         <Link 
            href={route('loans.index')} 
            className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            Back to Loans
          </Link>}
          {userPermission.includes('Edit loan') &&
            <Link
              href={route('loans.edit', loan.id)}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
            >
              Edit
            </Link>}
            {userPermission.includes('Delete loan') &&
            <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDelete(loan.id); 
                }}
                className="inline"
              >
                <button type="submit" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
                  Delete
                </button>

            </form>}
      
          {((loan.status === 'Pending' || loan.status === 'Declined') && userPermission.includes('Edit loan')) && (
            <Link
              href={route('loans.approval', loan.id)}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
            >
              Process advance
            </Link>)}
        </div>
      </div>
    </Layout>
  );
};

export default Show;
