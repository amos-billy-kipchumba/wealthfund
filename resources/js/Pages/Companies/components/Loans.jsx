import React, { useState } from "react";
import { Link, usePage, router, useForm } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';
import { FileText, FileSpreadsheet, Plus, Filter, X, Check, XCircle } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';

const Loans = ({ companyId, loans, roleId, status }) => {

  const [search, setSearch] = useState("");

   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
   const [selectedLoans, setSelectedLoans] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("companies.show", companyId), { search }, { preserveState: true });
  };

  const handlePageChange = (url) => {
    if (url) {
      router.get(url, {}, { preserveState: true });
    }
  };

  const filteredLoans = status === "All" 
    ? loans.data 
    : loans.data.filter((loan) => loan.status.toLowerCase() === status.toLowerCase());
    


    const generatePDF = () => {
      const doc = new jsPDF();
      const logoUrl = '/images/logo-dark.png';
      doc.addImage(logoUrl, 'PNG', 10, 10, 80, 30);
      doc.setFontSize(14);
      doc.text(`Loans Report`, 14, 50);
      
      const columns = ["Loan number", "Employee name", "Principle","Charges","Loan due","Current balance", "Status"];
      
      const rows = filteredLoans.map(data => [
        data.number, 
        data.employee?.user?.name, 
        new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.amount - data.charges), 
        new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.charges),
        new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.amount),
        new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.currentBalance),
        data.status
      ]);
      
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 60,
      });
      
      doc.save("loans_reports.pdf");
    };
  
    const generateExcel = () => {
      const ws = XLSX.utils.json_to_sheet(filteredLoans.map((data) => ({
        Loan_Number:data.number, 
        Employee_Name:data.employee?.user?.name, 
        Principle:new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.amount - data.charges), 
        Charges:new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.charges), 
        Loan_due: new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.amount),
        Current_balance:new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.currentBalance), 
        Status:data.status
      })));
    
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Loans');
      XLSX.writeFile(wb, 'loans_report.xlsx');
    };
    
    const handleSelectLoan = (id) => {
      setSelectedLoans((prev) =>
        prev.includes(id) ? prev.filter((loanId) => loanId !== id) : [...prev, id]
      );
    };
  
    const handleSelectAll = () => {
      if (selectedLoans.length === filteredLoans.length) {
        setSelectedLoans([]);
      } else {
        setSelectedLoans(filteredLoans.map((loan) => loan.id));
      }
    };
  
    const handleBulkAction = () => {
      if (selectedLoans.length === 0) {
        Swal.fire('No loans selected', 'Please select at least one loan.', 'warning');
        return;
      }
  
      Swal.fire({
        title: 'Are you sure?',
        text: `This will mark ${selectedLoans.length} loan(s) as Paid and create repayment records.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, mark as Paid!',
      }).then((result) => {
        if (result.isConfirmed) {
          router.post(route('loans.bulkUpdate'), { loanIds: selectedLoans }, {
            onSuccess: () => {
              Swal.fire('Success', 'Loans marked as Paid successfully!', 'success');
              setSelectedLoans([]);
            },
            onError: (err) => {
              console.error('Bulk update error:', err);
              Swal.fire('Error', 'Failed to update loans.', 'error');
            },
          });
        }
      });
    };
  return (
    <div>
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
              Loans Directory
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              <Link
                href={route('loans.create')}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                Create
                </span>
              </Link>
              <button
                onClick={generatePDF}
                disabled={loans.length === 0}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  PDF
                </span>
              </button>
              <button
                onClick={generateExcel}
                disabled={loans.length === 0}
                className="inline-flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  Excel
                </span>
              </button>
              {roleId !== 3 &&
                <button
                  onClick={handleBulkAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark as Paid
                </button>}
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-4">
          <form onSubmit={handleSearch} className="my-4 flex space-x-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search loans..."
          className="p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
      </form>
          </div>
        </div>


      {/* Loans Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr>
                {roleId !== 3 &&
                <th className="px-4 py-3">
                    <input
                    type="checkbox"
                    checked={selectedLoans.length === loans.length}
                    onChange={handleSelectAll}
                    />
                </th>}
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Loan number</th>
                {roleId !== 3 &&
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Employee Name</th>}
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Principle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Charges</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Loan due</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Current balance</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <tr key={loan.id}>
                    {roleId !== 3 &&
                    <td className="px-4 py-4">
                        <input
                        type="checkbox"
                        checked={selectedLoans.includes(loan.id)}
                        onChange={() => handleSelectLoan(loan.id)}
                        />
                    </td>}
                    <td className="px-6 py-4 whitespace-nowrap">{loan.number}</td>
                    {roleId !== 3 &&
                    <td className="px-6 py-4 whitespace-nowrap">{loan.employee?.user?.name}</td>}
                    <td className="px-6 py-4 whitespace-nowrap">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(loan.amount - loan.charges)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(loan.charges)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(loan.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(loan.currentBalance)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{loan.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-3">
                        <Link
                            href={route('loans.show', loan.id)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            View
                        </Link>
                        {roleId === 1 &&
                            <Link
                            href={route('loans.edit', loan.id)}
                            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                            >
                            Edit
                            </Link>
                        }
                        </div>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-600">
                  No loans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex space-x-2">
        {loans.links.map((link, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(link.url)}
            className={`px-3 py-1 border rounded ${
              link.active ? "bg-yellow-600 text-white" : "hover:bg-gray-200"
            }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
            disabled={!link.url}
          />
        ))}
      </div>
    </div>
  );
};

export default Loans;
