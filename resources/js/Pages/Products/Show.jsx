import React, { useState } from "react";
import { Link, router, Head, useForm, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';

const Show = ({ product }) => {
  const [activeTab, setActiveTab] = useState("Details");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { delete: destroy } = useForm();

  const { auth } = usePage().props; 
  
const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];

    

  const handleFilter = () => {
    router.get(route("products.show", product.id), {
      start_date: startDate ? startDate.toISOString().split("T")[0] : "",
      end_date: endDate ? endDate.toISOString().split("T")[0] : "",
    });
  };

  const handleDelete = (productId) => {
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
        destroy(route('products.destroy', productId), {
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
      <Head title={product.name} />
      <div className="max-w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">{product.name} - {product.unique_number}</h1>

        <div className="grid grid-cols-2 gap-4 mt-4 w-full overflow-x-auto">
          {/* Tabs Navigation */}
          <div className="card flex-1 justify-start items-start">
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <strong className="text-gray-600">Name:</strong> 
                  <span className="text-gray-800">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-600">Amount:</strong> 
                  <span className="text-gray-800">{product.amount}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-600">Days:</strong> 
                  <span className="text-gray-800">{product.days}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-600">Payout:</strong> 
                  <span className="text-gray-800">{product.payout}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-left flex gap-4">
          {userPermission.includes('Index product') &&
          <Link 
            href={route("products.index")} 
            className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            Back to Products
          </Link>}

          {userPermission.includes('Edit product') &&
          <Link 
            href={route('products.edit', product.id)} 
            className="flex items-center bg-yellow-500 text-white rounded-lg text-xs hover:bg-yellow-600"
          >
            <span className="my-auto px-4 py-2">Edit</span>
          </Link>}

          {userPermission.includes('Delete product') &&
          <button
            onClick={() => handleDelete(product.id)}
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
