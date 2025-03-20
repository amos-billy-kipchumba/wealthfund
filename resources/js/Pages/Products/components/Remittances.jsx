import React, { useState } from "react";
import { Link, usePage, router, useForm } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';
import { FileText, FileSpreadsheet, Plus, Filter, X, Check, XCircle } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';

const Remittances = ({ productId, remittances, roleId }) => {
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

    const handleDelete = (remittanceId) => {
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
          destroy(route('remittances.destroy', remittanceId));
        }
      });
    };
  
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Remittances Report`, 14, 20);
    
    const columns = ["Remittance Number", "Product Name"];
    const rows = remittances?.data?.map(data => [
      data.remittance_number, 
      data.product?.name
    ]);
    
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
    });
    
    doc.save("remittances_report.pdf");
  };

  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(remittances?.data.map((data) => ({
      Remittance_Number: data.remittance_number,
      Product_Name: data.product?.name
    })));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Remittances');
    XLSX.writeFile(wb, 'remittances_report.xlsx');
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
              Remittances Directory
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              <Link
                href={route('remittances.create')}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                Create
                </span>
              </Link>
              <button
                onClick={generatePDF}
                disabled={remittances.length === 0}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  PDF
                </span>
              </button>
              <button
                onClick={generateExcel}
                disabled={remittances.length === 0}
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
          placeholder="Search remittances..."
          className="p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
      </form>
          </div>
        </div>


      {/* remittances Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Remittance Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Product Name</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {remittances.data.length > 0 ? (
              remittances.data.map((remittance) => (
                <tr key={remittance.id}>
                    <td className="px-6 py-4">{remittance.remittance_number}</td>
                        <td className="px-6 py-4">{remittance.product?.name}</td>
                        <td className="px-6 py-4 text-right">
                        <Link href={route('remittances.show', remittance.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">View</Link>
                        {roleId === 1 && (
                            <>
                            <Link href={route('remittances.edit', remittance.id)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 ml-2">Edit</Link>
                            <button onClick={() => handleDelete(remittance.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-2">Delete</button>
                            </>
                        )}
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-600">
                  No remittances found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex space-x-2">
        {remittances.links.map((link, index) => (
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

export default Remittances;
