import React, { useState } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import { FileText, FileSpreadsheet, Plus, Filter, X } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Index = () => {
  const { repayments, flash, pagination, auth } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const roleId = auth.user?.role_id;

  const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];
  const [selectedPayments, setSelectedPayments] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setLoading(true);

    router.get(route('repayments.index'), { search: e.target.value }, {
      preserveState: true,
      onFinish: () => setLoading(false),
    });
  };

  // New function to handle single repayment status update
  const handleSingleStatusUpdate = (repaymentId) => {
    Swal.fire({
      title: 'Update Repayment Status',
      text: 'Are you sure you want to mark this repayment as Paid?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark as Paid!'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('repayments.updateStatus'), { 
          repaymentIds: [repaymentId],
          status: 'Paid' 
        }, {
          onSuccess: () => {
            Swal.fire('Success', 'Repayment status updated successfully!', 'success');
            // Optional: Refresh the page or update the local state
          },
          onError: (error) => {
            Swal.fire('Error', 'Failed to update repayment status.', 'error');
            console.error('Update error:', error);
          }
        });
      }
    });
  };

  // Updated bulk action function for multiple repayments
  const handleBulkAction = () => {
    if (selectedPayments.length === 0) {
      Swal.fire('No repayments selected', 'Please select at least one repayment.', 'warning');
      return;
    }

    router.post(route('repayments.updateStatus'), { 
      repaymentIds: selectedPayments,
      status: 'Paid' 
    }, {
      onSuccess: () => {
        toast.success('Payments marked as Paid successfully!');
        setSelectedPayments([]); 
      },
      onError: (error) => {
        toast.error('Failed to update repayments.');
      }
    });
  };

  const handleSelectPayment = (id) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((paymentId) => paymentId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === repayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(repayments.map((repayment) => repayment.id));
    }
  };

  // Rest of the component remains the same...

  return (
    <Layout>
      <Head title="List repayments" />

      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
      />

      <div className="w-full">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mobileFiltersOpen ? (
                <>
                  <X className="w-5 h-5 mr-2" /> Close Filters
                </>
              ) : (
                <>
                  <Filter className="w-5 h-5 mr-2" /> Open Filters
                </>
              )}
            </button>
          </div>

          {/* Top Section - Responsive */}
          <div className={`
            ${mobileFiltersOpen ? 'sm:block' : 'sm:hidden lg:block'} 
            lg:block bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4
          `}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900 w-full sm:w-auto my-auto">
                Repayments Directory
              </h1>
              
              <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
                {userPermission.includes('Create payment') &&
                <Link
                  href={route('repayments.create')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-2 my-auto" />
                  <span className='my-auto'>
                  Create
                  </span>
                </Link>}
                {userPermission.includes('Export payment') &&
                <button
                  onClick={generatePDF}
                  disabled={repayments.length === 0}
                  className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 mr-2 my-auto" />
                  <span className='my-auto'>
                    PDF
                  </span>
                </button>}
                {userPermission.includes('Export payment') &&
                <button
                  onClick={generateExcel}
                  disabled={repayments.length === 0}
                  className="inline-flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2 my-auto" />
                  <span className='my-auto'>
                    Excel
                  </span>
                </button>}
                {roleId === 1  &&
                <button
                  onClick={handleBulkAction}
                  className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark as Paid
                </button>}
              </div>
          </div>

            {/* Search Input */}
            <div className="mt-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search repayments..."
              />
              {loading && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
            </div>
        </div>

        {/* Flash Message */}
        {flash?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-900">
            <strong className="font-semibold">Success: </strong>
            {flash.success}
          </div>
        )}

        {/* Repayments Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
              {userPermission.includes('Edit asset') &&
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedPayments.length === repayments.length}
                    onChange={handleSelectAll}
                  />
                </th>}
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Withdrawal Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Investor Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Withdrawal</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {repayments.length > 0 ? (
                  repayments.map((repayment) => (
                    <tr key={repayment.id}>
                      {roleId === 1 && (
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPayments.includes(repayment.id)}
                            onChange={() => handleSelectPayment(repayment.id)}
                          />
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">{repayment.number}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{repayment?.investor?.user?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(repayment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{repayment?.status}</td>
                      {userPermission.includes('Edit payment') && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {repayment.status === 'Pending' && (
                            <button 
                              onClick={() => handleSingleStatusUpdate(repayment.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Mark as Paid
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No repayments found.</td>
                  </tr>
                )}
              </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.total > pagination.per_page && (
          <div className="my-6 flex justify-center">
            <div className="inline-flex gap-2">
              {pagination.prev_page_url && (
                <Link
                  href={pagination.prev_page_url}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Previous
                </Link>
              )}
              {pagination.next_page_url && (
                <Link
                  href={pagination.next_page_url}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
