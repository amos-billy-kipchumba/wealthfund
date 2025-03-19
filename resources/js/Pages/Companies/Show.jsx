import React, { useState } from "react";
import { Link, router, Head, useForm, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import Employees from "./components/Employees";
import Loans from "./components/Loans";
import Remittances from "./components/Remittances";
import Repayments from "./components/Repayments";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import Details from "./components/Details";

const Show = ({ company, employees, loans, remittances, repayments }) => {
  const [activeTab, setActiveTab] = useState("Details");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { delete: destroy } = useForm();

  const { auth } = usePage().props; 
  
const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];

    

  const handleFilter = () => {
    router.get(route("companies.show", company.id), {
      start_date: startDate ? startDate.toISOString().split("T")[0] : "",
      end_date: endDate ? endDate.toISOString().split("T")[0] : "",
    });
  };

  const handleDelete = (companyId) => {
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
        destroy(route('companies.destroy', companyId), {
          onSuccess: () => {
            console.log('Deleted successfully');
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
      <Head title={company.name} />
      <div className="max-w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">{company.name} - {company.unique_number}</h1>

        <div className="grid grid-cols-2 gap-4">
          {/* Date Range Filter */}
          <div className="space-y-4 card">
            <h2 className="text-lg font-semibold text-gray-700">Filter by Date Range</h2>
            <div className="flex space-x-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="border rounded px-3 py-2"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="End Date"
                className="border rounded px-3 py-2"
              />
              <button
                onClick={handleFilter}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 w-full overflow-x-auto">
          {/* Tabs Navigation */}
          <div className="card flex-1 justify-start items-start">
            <div className="flex justify-start">
              <nav className="flex overflow-x-auto items-start p-1 space-x-1 text-sm text-gray-600 bg-gray-500/5 rounded-xl">
              {["Details", "Employees", "Advances", "Approved Advances", "Pending Advances", "Declined Advances", "Paid Advances","Repayments", "Remittances"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`h-8 px-5 font-medium rounded-lg outline-none ${
                      activeTab === tab ? "text-yellow-600 shadow bg-white" : "hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tabs Content */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              {activeTab === "Details" && <Details company={company} />}
              {activeTab === "Employees" && <Employees companyId={company.id} employees={employees} />}
              {activeTab === "Advances" && <Loans companyId={company.id} loans={loans} status='All' />}
              {activeTab === "Approved Advances" && <Loans companyId={company.id} loans={loans} status='Approved' />}
              {activeTab === "Pending Advances" && <Loans companyId={company.id} loans={loans} status='Pending' />}
              {activeTab === "Declined Advances" && <Loans companyId={company.id} loans={loans} status='Declined' />}
              {activeTab === "Paid Advances" && <Loans companyId={company.id} loans={loans} status='Paid' />}
              {activeTab === "Repayments" && <Repayments companyId={company.id} repayments={repayments} />}
              {activeTab === "Remittances" && <Remittances companyId={company.id} remittances={remittances} />}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-left flex gap-4">
          {userPermission.includes('Index company') &&
          <Link 
            href={route("companies.index")} 
            className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            Back to Companies
          </Link>}

          {userPermission.includes('Edit company') &&
          <Link 
            href={route('companies.edit', company.id)} 
            className="flex items-center bg-yellow-500 text-white rounded-lg text-xs hover:bg-yellow-600"
          >
            <span className="my-auto px-4 py-2">Edit</span>
          </Link>}

          {userPermission.includes('Delete company') &&
          <button
            onClick={() => handleDelete(company.id)}
            className="flex items-center cursor-pointer bg-red-600 text-white rounded-lg text-xs hover:bg-red-700"
          >
            <span className="my-auto px-4 py-2">Delete</span> 
          </button>}
        </div>
      </div>
    </Layout>
  );
};

export default Show;
