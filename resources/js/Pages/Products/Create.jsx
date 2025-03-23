import React, { useState, useCallback } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";

const Create = () => {
  const { data, setData, post, errors, processing } = useForm({
    product: {
      name: '',
      amount: '',
      days: '',
      payout: '',
      logo: null
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.entries(data.product).forEach(([key, value]) => {
      if (value) {
        formData.append(`product[${key}]`, value);
      }
    });

    post(route("products.store"), formData);
  };

  // Handle File Selection
  const handleProductChange = useCallback((e) => {
    const { name, files, value, type } = e.target;

    setData(prevData => ({
      ...prevData,
      product: {
        ...prevData.product,
        [name]: type === "file" ? files[0] : value,
      }
    }));
  }, [setData]);

  // Remove a specific file
  const removeFile = (fileKey) => {
    setData(prevData => ({
      ...prevData,
      product: {
        ...prevData.product,
        [fileKey]: null
      }
    }));
  };

  return (
    <Layout>
      <Head title="Create Product" />
      
      <div className="max-w-4xl mb-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Create New Product</h1>
            <p className="text-blue-100 mt-1">Please fill out the form to create a new product</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-3xl font-medium text-gray-800 pb-2 border-b border-gray-200">
                  <span>Product Information</span>
                </div>
                
                <div className="flex flex-wrap gap-x-6">
                  <div className="mb-4 flex-1 flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product name <span className="text-red-500">*</span>
                    </label>

                    <input
                      type='text'
                      name='name'
                      value={data.product?.name} 
                      onChange={handleProductChange}
                      className={`min-w-full px-4 py-2 rounded-md border ${errors['product.name'] ? 'border-red-500' : 'border-gray-300'} 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      required
                    />
                    {errors['product.name'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['product.name']}</p>
                    )}
                  </div>

                  <div className="mb-4 flex-1 flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>

                    <input
                      type='number'
                      step="any"
                      min='0'
                      name='amount'
                      value={data.product?.amount} 
                      onChange={handleProductChange}
                      className={`min-w-full px-4 py-2 rounded-md border ${errors['product.amount'] ? 'border-red-500' : 'border-gray-300'} 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      required
                    />
                    {errors['product.amount'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['product.amount']}</p>
                    )}
                  </div>

                  <div className="mb-4 flex-1 flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Days <span className="text-red-500">*</span>
                    </label>

                    <input
                      type='number'
                      step="1"
                      min='1'
                      name='days'
                      value={data.product?.days}
                      onChange={handleProductChange}
                      className={`min-w-full px-4 py-2 rounded-md border ${errors['product.days'] ? 'border-red-500' : 'border-gray-300'} 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      required
                    />
                    {errors['product.days'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['product.days']}</p>
                    )}
                  </div>

                  <div className="mb-4 flex-1 flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payout <span className="text-red-500">*</span>
                    </label>

                    <input
                      type='number'
                      step="any"
                      min='0'
                      name='payout'
                      value={data.product?.payout}
                      onChange={handleProductChange}
                      className={`min-w-full px-4 py-2 rounded-md border ${errors['product.payout'] ? 'border-red-500' : 'border-gray-300'} 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      required
                    />
                    {errors['product.payout'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['product.payout']}</p>
                    )}
                  </div>

                  <div className="mb-4 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo
                    </label>

                    <input
                      type="file"
                      name="logo"
                      onChange={handleProductChange}
                      className="mt-1 block w-full text-sm border border-gray-300 rounded-lg p-2"
                    />
                    {data.product.logo && (
                      <div className="mt-2 flex items-center">
                        <span className="text-sm text-gray-600">{data.product.logo.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile('logo')}
                          className="ml-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {errors['product.logo'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['product.logo']}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={processing}
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-1 px-6 rounded-lg font-medium 
                  hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                  shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Create;