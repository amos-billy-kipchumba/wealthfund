import React, { useState } from 'react';
import { Link, usePage, router, Head} from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import { FileText, FileSpreadsheet, Plus, Filter, X } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';

const Index = () => {
  const { employees, flash, pagination, auth } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setLoading(true);

    router.get(route('employees.index'), { search: e.target.value }, {
      preserveState: true,
      onFinish: () => setLoading(false),
    });
  };


  const generatePDF = () => {
    const doc = new jsPDF();
    const logoUrl = '/images/logo-dark.png';
    doc.addImage(logoUrl, 'PNG', 10, 10, 80, 30);
    doc.setFontSize(14);
    doc.text(`Employees Report`, 14, 50);
    
    const columns = ["Name", "Email", "Phone", "Salary", "Loan Limit","Unpaid loans","Total Loan Balance"];
    
    const rows = employees.map(data => [
      data.user?.name, 
      data.user?.email, 
      data.user?.phone || 'N/A', 
      data.salary,
      data.loan_limit,
      data.unpaid_loans_count,
      data.total_loan_balance
    ]);
    
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 60,
    });
    
    doc.save("employees_reports.pdf");
  };

  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(employees.map((data) => ({
      Name: data.user?.name,
      Email: data.user?.email,
      Phone: data.user?.phone || 'N/A',
      Salary: data.salary,
      Loan_Limit: data.loan_limit,
      Unpaid_loans: data.unpaid_loans_count,
      Total_Loan_Balance: data.total_loan_balance,
    })));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, 'employees_report.xlsx');
  };

  return (
    <Layout>
      <Head title="Employee list" />
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
          ${mobileFiltersOpen ? 'block' : 'hidden'} 
          lg:block bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4
        `}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 w-full sm:w-auto my-auto">
              Employees Directory
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              {userPermission.includes('Create employee') &&
              <Link
                href={route('employees.create')}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                Create
                </span>
              </Link>}
              {userPermission.includes('Export employee') &&
              <button
                onClick={generatePDF}
                disabled={employees.length === 0}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  PDF
                </span>
              </button>}
              {userPermission.includes('Export employee') &&
              <button
                onClick={generateExcel}
                disabled={employees.length === 0}
                className="inline-flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  Excel
                </span>
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
              placeholder="Search employees..."
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
                {["Name", "Email", "Phone", "Salary", "Loan Limit","Unpaid loans","Total Loan Balance", "Actions"].map((header) => (
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
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-4 py-4">{employee.user?.name}</td>
                    <td className="px-4 py-4">{employee.user?.email}</td>
                    <td className="px-4 py-4">{employee.user?.phone || 'N/A'}</td>
                    <td className="px-4 py-4">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(employee.salary)}</td>
                    <td className="px-4 py-4">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(employee.loan_limit)}</td>
                    <td className="px-4 py-4">{employee.unpaid_loans_count}</td>
                    <td className="px-4 py-4">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(employee.total_loan_balance)}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {userPermission.includes('View employee') &&
                        <Link 
                          href={route('employees.show', employee.id)} 
                          className="bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 flex items-center"
                        >
                          <span className="my-auto px-4 py-2">View</span>
                        </Link>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No employees found.</td>
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