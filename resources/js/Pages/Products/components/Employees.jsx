import React, { useState } from "react";
import { Link, router, } from '@inertiajs/react';
import { FileText, FileSpreadsheet, Plus, Filter, X } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';

const Employees = ({ productId, employees }) => {
  const [search, setSearch] = useState("");

   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);


  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("products.show", productId), { search }, { preserveState: true });
  };

  const handlePageChange = (url) => {
    if (url) {
      router.get(url, {}, { preserveState: true });
    }
  };

    const generatePDF = () => {
    const doc = new jsPDF();
    const logoUrl = '/images/logo-dark.png';
    doc.addImage(logoUrl, 'PNG', 10, 10, 80, 30);
    doc.setFontSize(14);
    doc.text(`Employees Report`, 14, 50);
    
    const columns = ["Name", "Email", "Phone", "Salary", "Asset Limit","Unpaid asset","Total asset balance"];
    
    const rows = employees.data?.map(data => [
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
    
    doc.save("employees_reports.pdf");
    };

    const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(employees?.data?.map((data) => ({
        Name: data.user?.name,
        Email: data.user?.email,
        Phone: data.user?.phone || 'N/A',
        Salary: data.salary,
        Salary_Advance_Limit: data.asset_limit,
        Unpaid_salary_advances: data.unpaid_assets_count,
        Total_Salary_advances_Balance: data.total_asset_balance,
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, 'employees_report.xlsx');
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
              Employees Directory
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              <Link
                href={route('employees.create')}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                Create
                </span>
              </Link>
              <button
                onClick={generatePDF}
                disabled={employees.length === 0}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  PDF
                </span>
              </button>
              <button
                onClick={generateExcel}
                disabled={employees.length === 0}
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
          <form onSubmit={handleSearch} className="my-4 flex space-x-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employees..."
          className="p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
      </form>
          </div>
        </div>


      {/* Employees Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Asset Limit</th>
              <th className="px-4 py-2">Unpaid Assets</th>
              <th className="px-4 py-2">Asset Balance</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.data.length > 0 ? (
              employees.data.map((employee) => (
                <tr key={employee.id} className="border-t">
                  <td className="px-4 py-4">{employee.user.name}</td>
                  <td className="px-4 py-4">{employee.user.email}</td>
                  <td className="px-4 py-4">{employee.user.phone || 'N/A'}</td>
                  <td className="px-4 py-4">{employee.salary}</td>
                  <td className="px-4 py-4">{employee.asset_limit}</td>
                  <td className="px-4 py-4">{employee.unpaid_assets_count || 0}</td>
                  <td className="px-4 py-4">{employee.total_asset_balance || 0}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* View Employee */}
                      <Link 
                        href={route('employees.show', employee.id)} 
                        className="bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 flex items-center"
                      >
                        <span className="my-auto px-4 py-2">View</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-600">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex space-x-2">
        {employees.links.map((link, index) => (
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

export default Employees;
