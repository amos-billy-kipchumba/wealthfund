import React, { useState } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import "react-daterange-picker/dist/css/react-calendar.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';
import { FileText, FileSpreadsheet, Plus, Filter, X } from 'lucide-react';

const Index = () => {
  const { products, flash, pagination, auth } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setLoading(true);

    router.get(route('products.index'), { search: e.target.value }, {
      preserveState: true,
      onFinish: () => setLoading(false),
    });
  };


  const generatePDF = () => {
    const doc = new jsPDF();
    const logoUrl = '/images/logo.png';
    doc.addImage(logoUrl, 'PNG', 10, 10, 80, 30);
    doc.setFontSize(14);
    doc.text(`All Products Report`, 14, 50);
    
    const columns = [
      "Name", 
      "Industry", 
      "Address", 
      "Email", 
      "Phone"
    ];
    
    const rows = products.map(data => [
      data.name, 
      data.industry, 
      data.address, 
      data.email,
      data.phone
    ]);
    
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 60,
    });
    
    doc.save("products_reports.pdf");
  };

  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(products.map((data) => ({
      Name: data.name,
      Industry: data.industry,
      Address: data.address,
      Email: data.email,
      Phone: data.phone
    })));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'products_report.xlsx');
  };

  return (
    <Layout>
      <Head title="List products" />
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
              Products Directory
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              {userPermission.includes('Create product') &&
              <Link
                href={route('products.create')}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                Create
                </span>
              </Link>}
              {userPermission.includes('Export product') &&
              <button
                onClick={generatePDF}
                disabled={products.length === 0}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  PDF
                </span>
              </button>}
              {userPermission.includes('Export notification') &&
              <button
                onClick={generateExcel}
                disabled={products.length === 0}
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
              placeholder="Search products..."
            />
            {loading && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
          </div>
        </div>

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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase"></th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Unique number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Days</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Payout</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className=''>
                    <td className="px-6 py-4">
                      <img
                          src={`/storage/${product.logo}`}
                          alt="ID Front"
                          className="w-full max-h-[5vh] object-cover rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 my-auto">{product.name}</td>
                    <td className="px-6 py-4">{product.unique_number}</td>
                    <td className="px-6 py-4">{product.amount}</td>
                    <td className="px-6 py-4">{product.days}</td>
                    <td className="px-6 py-4">{product.payout}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {userPermission.includes('View product') &&
                        <Link 
                          href={route('products.show', product.id)} 
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
                  <td colSpan="6" className="text-center py-4">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.total > pagination.per_page && (
          <div className="my-6 flex justify-center">
            <div className="inline-flex gap-2">
              {pagination.prev_page_url && (
                <Link href={pagination.prev_page_url} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Previous</Link>
              )}
              {pagination.next_page_url && (
                <Link href={pagination.next_page_url} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
