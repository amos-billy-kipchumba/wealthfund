import React, { useState } from 'react';
import { Link, usePage, router, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { FileText, FileSpreadsheet, Plus, Filter, X, Check, XCircle } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';

const Investors = () => {
  const { investors, flash, pagination, auth } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const roleId = auth.user?.role_id;
  const { processing } = useForm({
    approved: ''
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setLoading(true);

    router.get(route('investors.index'), { search: e.target.value }, {
      preserveState: true,
      onFinish: () => setLoading(false),
    });
  };

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

  const generatePDF = () => {
    const doc = new jsPDF();
    const logoUrl = '/images/logo.png';
    doc.addImage(logoUrl, 'PNG', 10, 10, 80, 30);
    doc.setFontSize(14);
    doc.text(`Investors Report`, 14, 50);
    
    const columns = ["Name", "Email", "Phone", "Salary", "Asset Limit","Unpaid assets","Total Asset Balance"];
    
    const rows = investors.map(data => [
      data.user?.name, 
      data.user?.email, 
      data.user?.phone || 'N/A', 
      data.salary,
      data.asset_limit,
      data.unpaid_assets_count,
      data.total_asset_balance
    ]);
    
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 60,
    });
    
    doc.save("investors_reports.pdf");
  };

  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(investors.map((data) => ({
      Name: data.user?.name,
      Email: data.user?.email,
      Phone: data.user?.phone || 'N/A',
      Salary: data.salary,
      Asset_Limit: data.asset_limit,
      Unpaid_assets: data.unpaid_assets_count,
      Total_Asset_Balance: data.total_asset_balance,
    })));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Investors');
    XLSX.writeFile(wb, 'investors_report.xlsx');
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
      <div className="">
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
          ${mobileFiltersOpen ? 'block' : 'hidden'} 
          lg:block bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4
        `}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 w-full sm:w-auto my-auto">
              Investors Directory
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              <Link
                href={route('investors.create')}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                Create
                </span>
              </Link>
              <button
                onClick={generatePDF}
                disabled={investors?.length === 0}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  PDF
                </span>
              </button>
              <button
                onClick={generateExcel}
                disabled={investors?.length === 0}
                className="inline-flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  Excel
                </span>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search investors..."
            />
            {loading && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
          </div>
        </div>

        {/* Rest of the component remains largely the same */}
        {flash?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-900">
            <strong className="font-semibold">Success: </strong>
            {flash.success}
          </div>
        )}

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                {["Name", "Email", "Phone", "Salary", "Asset Limit","Unpaid assets","Total Asset Balance", "Actions"].map((header) => (
                  <th 
                    key={header} 
                    className={`
                      px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                      ${header === "Actions" ? "text-right" : ""}
                    `}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {investors?.length > 0 ? (
                investors.map((investor) => (
                  <tr key={investor.id}>
                    <td className="px-4 py-4">{investor.user.name}</td>
                    <td className="px-4 py-4">{investor.user.email}</td>
                    <td className="px-4 py-4">{investor.user.phone || 'N/A'}</td>
                    <td className="px-4 py-4">{investor.salary}</td>
                    <td className="px-4 py-4">{investor.asset_limit}</td>
                    <td className="px-4 py-4">{investor.unpaid_assets_count}</td>
                    <td className="px-4 py-4">{investor.total_asset_balance}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={route('investors.show', investor.id)} 
                          className="bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 flex items-center"
                        >
                          <span className="my-auto px-4 py-2">View</span>
                        </Link>
                        <Link 
                          href={route('investors.edit', investor.id)} 
                          className="flex items-center bg-yellow-500 text-white rounded-lg text-xs hover:bg-yellow-600"
                        >
                          <span className="my-auto px-4 py-2">Edit</span>
                        </Link>
                        {roleId === 1 &&
                        <button
                          onClick={() => handleDelete(investor.id)}
                          className="flex items-center cursor-pointer bg-red-600 text-white rounded-lg text-xs hover:bg-red-700"
                        >
                         <span className="my-auto px-4 py-2">Delete</span> 
                        </button>}
                        {investor.salary &&
                        <>
                        {(investor.approved !== 'Approved' && roleId !== 3) &&
                          <button
                            onClick={(e) => handleApprovedUpdate(e, investor.id, 'Approved')}
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
                          >
                            <Check className="w-4 h-4 mr-2" /> Approve
                          </button>}

                        {(investor.approved !== 'Declined' && roleId !== 3) &&
                        <button
                          onClick={(e) => handleApprovedUpdate(e, investor.id, 'Declined')}
                          disabled={processing}
                          className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Decline
                        </button>}
                        </>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No investors found.</td>
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
  );
};

export default Investors;