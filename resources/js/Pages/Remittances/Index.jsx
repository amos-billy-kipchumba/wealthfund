import React, { useState } from 'react';
import { Link, usePage, router, useForm, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';
import { FileText, FileSpreadsheet, Plus, Filter, X } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';

const Index = () => {
  const { remittances, flash, pagination, auth } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const roleId = auth.user?.role_id;

const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];



  const { delete: destroy } = useForm();

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setLoading(true);
    
    router.get(route('remittances.index'), { search: e.target.value }, {
      preserveState: true,
      onFinish: () => setLoading(false),
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Remittances Report`, 14, 20);
    
    const columns = ["Remittance Number", "Company Name"];
    const rows = remittances.map(data => [
      data.remittance_number, 
      data.company?.name
    ]);
    
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
    });
    
    doc.save("remittances_report.pdf");
  };

  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(remittances.map((data) => ({
      Remittance_Number: data.remittance_number,
      Company_Name: data.company?.name
    })));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Remittances');
    XLSX.writeFile(wb, 'remittances_report.xlsx');
  };

  return (
    <Layout>
      <Head title="List remittance" />
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Remittances Directory</h1>
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
          placeholder="Search by company name..."
        />
        {loading && <p className="text-sm text-gray-500">Searching...</p>}
        
        {flash?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-900">
            <strong>Success: </strong>{flash.success}
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Remittance Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Company Name</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {remittances.length > 0 ? (
                remittances.map((remittance) => (
                  <tr key={remittance.id}>
                    <td className="px-6 py-4">{remittance.remittance_number}</td>
                    <td className="px-6 py-4">{remittance.company?.name}</td>
                    <td className="px-6 py-4 text-right">
                      {userPermission.includes('View remittance') &&
                      <Link href={route('remittances.show', remittance.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">View</Link>}
                      {userPermission.includes('Edit remittance') &&
                      <Link href={route('remittances.edit', remittance.id)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 ml-2">Edit</Link>}
                      {userPermission.includes('Delete remittance') &&
                      <button onClick={() => handleDelete(remittance.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-2">Delete</button>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">No remittances found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
