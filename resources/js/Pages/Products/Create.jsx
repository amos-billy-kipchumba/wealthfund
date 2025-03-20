import React, { useState, useCallback } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Counties from '@/Components/Counties';
import Select from 'react-select';  
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const Create = () => {
  const { data, setData, post, errors, processing } = useForm({
    product: {
      name: '',
      industry: '',
      address: '',
      email: '',
      phone: '',
      percentage: '',
      asset_limit: 67,
      registration_number: '',
      sectors: '',
      county: '',
      sub_county: '',
      location: '',
      certificate_of_incorporation: null,
      kra_pin: null,
      cr12_cr13: null,
      signed_agreement: null,
      additional_documents: []
    },
    user: {
      name: '',
      phone: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
  });

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(data);
    

      const formData = new FormData();
      Object.entries(data.product).forEach(([key, value]) => {
          if (value) {
              if (Array.isArray(value)) {
                  value.forEach((file, index) => formData.append(`${key}[${index}]`, file));
              } else {
                  formData.append(key, value);
              }
          }
      });

      Object.entries(data.user).forEach(([key, value]) => {
          formData.append(key, value);
      });

      post(route("products.store"), formData);
  };

  

  // Handle File Selection
  const handleProductChange = useCallback((e) => {
    const { name, files, value, type } = e.target;


    if (name === "additional_documents") {
      setData(prevData => ({
        ...prevData,
        product: {
          ...prevData.product,
          additional_documents: [...prevData.product.additional_documents, ...Array.from(files)]
        }
      }));
    } else {
      setData(prevData => ({
        ...prevData,
        product: {
          ...prevData.product,
          [name]: type === "file" ? files[0] : value, 
        }
      }));
    }
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

  // Remove a file from additional_documents
  const removeAdditionalFile = (index) => {
    setData(prevData => ({
      ...prevData,
      product: {
        ...prevData.product,
        additional_documents: prevData.product.additional_documents.filter((_, i) => i !== index)
      }
    }));
  };

  // Handle text input change
  const handleUserChange = useCallback((e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      user: {
        ...prevData.user,
        [name]: value
      }
    }));
  }, []);

  // Handle select changes
  const handleSelectChange = useCallback((name, selectedOption) => {
    setData(prevData => ({
      ...prevData,
      product: {
        ...prevData.product,
        [name]: selectedOption ? selectedOption.value : ""
      }
    }));
  }, []);

  const countyOptions = Object.keys(Counties)?.map((county) => ({
    value: county,
    label: county,
  }));  

  const subCountyOptions = data?.product?.county
    ? Counties[data?.product?.county]?.map((sub) => ({ value: sub, label: sub }))
    : [];

  // Progress indicator
  const ProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                  ${step >= stepNumber ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'}`}
              >
                {stepNumber}
              </div>
              <span className={`text-xs mt-2 ${step >= stepNumber ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {stepNumber === 1 ? "Product Info" : stepNumber === 2 ? "Documents" : "Admin User"}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 h-1 w-full bg-gray-200 rounded"></div>
          <div 
            className="absolute top-0 h-1 bg-blue-600 rounded transition-all duration-300" 
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Head title="Register Product with Admin" />
      
      <div className="max-w-4xl mb-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Register Product & Admin</h1>
            <p className="text-blue-100 mt-1">Please fill out the form to create a new product account</p>
          </div>
          
          <div className="p-8">
            <ProgressBar />
            
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              {/* Step 1: Product Information */}
              {step === 1 && (
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
                        className={`min-w-full px-4 py-2 rounded-md border ${errors['product?.name'] ? 'border-red-500' : 'border-gray-300'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      />
                    </div>



                    <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                      </label>

                      <input
                        type='email'
                        name='email'
                        value={data.product?.email} 
                        onChange={handleProductChange}
                        className={`min-w-full px-4 py-2 rounded-md border ${errors['product?.email'] ? 'border-red-500' : 'border-gray-300'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      />
                    </div>

                    <div className="mb-4 flex-1 flex-col">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone <span className="text-red-400">*</span>
                      </label>

                      <PhoneInput
                        international
                        defaultCountry="US"
                        value={data.product?.phone}
                        onChange={(value) => setData("product.phone", value)}
                        className="w-full px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {errors["product?.phone"] && (
                        <p className="text-red-500 text-xs mt-1">{errors["product?.phone"]}</p>
                      )}
                    </div>


                    <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                      </label>

                      <input
                        type='text'
                        name='address'
                        value={data.product?.address} 
                        onChange={handleProductChange}
                        className={`min-w-full px-4 py-2 rounded-md border ${errors['product?.address'] ? 'border-red-500' : 'border-gray-300'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      />
                    </div>

                    <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset interest rate <span className="text-red-500">*</span>
                      </label>

                      <input
                        type='number'
                        step="any"
                        min='0'
                        name='percentage'
                        value={data.product?.percentage} 
                        onChange={handleProductChange}
                        className={`min-w-full px-4 py-2 rounded-md border ${errors['product?.percentage'] ? 'border-red-500' : 'border-gray-300'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      />
                    </div>

                    <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset limit Percentage <span className="text-red-500">*</span>
                      </label>

                      <input
                        type='number'
                        step="any"
                        min='0'
                        name='asset_limit'
                        value={data.product?.asset_limit} 
                        onChange={handleProductChange}
                        className={`min-w-full px-4 py-2 rounded-md border ${errors['product?.asset_limit'] ? 'border-red-500' : 'border-gray-300'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      />
                    </div>

                    <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Number <span className="text-red-500">*</span>
                      </label>

                      <input
                        type='text'
                        name='registration_number'
                        value={data.product?.registration_number} 
                        onChange={handleProductChange}
                        className={`min-w-full px-4 py-2 rounded-md border ${errors['product?.registration_number'] ? 'border-red-500' : 'border-gray-300'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      />
                    </div>

                    <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry <span className="text-red-500">*</span>
                      </label>

                      <select
                        name="industry"
                        value={data.product?.industry || ""}
                        onChange={handleProductChange}
                        className={`min-w-full px-4 py-2 rounded-md border ${
                          errors["product?.industry"] ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      >
                        <option value="" disabled>Select an industry</option>
                        {[
                          "Accounting",
                          "Advertising/Marketing",
                          "Agriculture/Farming",
                          "Architecture",
                          "Arts/Entertainment",
                          "Automotive",
                          "Banking/Financial Services",
                          "Construction/Trades",
                          "Consulting",
                          "Education",
                          "Engineering",
                          "Food/Beverage",
                          "Healthcare/Medical",
                          "Hospitality",
                          "Insurance",
                          "Legal Services",
                          "Manufacturing",
                          "Nonprofit",
                          "Real Estate",
                          "Retail",
                          "Technology/IT",
                          "Transportation",
                          "Wholesale/Distribution",
                          "Other Services",
                        ].map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sectors <span className="text-red-500">*</span>
                      </label>

                      <input
                        type='text'
                        name='sectors'
                        value={data.product?.sectors} 
                        onChange={handleProductChange}
                        className={`min-w-full px-4 py-2 rounded-md border ${errors['product?.sectors'] ? 'border-red-500' : 'border-gray-300'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      />
                    </div>

                    <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      County <span className="text-red-500">*</span>
                      </label>

                      <Select
                        name="county"
                        value={countyOptions.find(option => option.value === data.product.county) || null}
                        onChange={(selectedOption) => handleSelectChange('county', selectedOption)}
                        options={countyOptions}
                        className={`w-full min-w-[250px] lg:min-w-[300px] ${
                          errors['product?.county'] ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        placeholder="Select county"
                        isClearable
                      />
                    </div>

                    <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub county <span className="text-red-500">*</span>
                      </label>

                      <Select
                        name="sub_county"
                        value={subCountyOptions.find(option => option.value === data.product.sub_county) || null}
                        onChange={(selectedOption) => handleSelectChange('sub_county', selectedOption)}
                        options={subCountyOptions}
                        className={`w-full min-w-[250px] lg:min-w-[300px] ${
                          errors['product?.sub_county'] ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        placeholder="Select sub county"
                        isClearable
                      />
                    </div>

                    <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        name="location"
                        value={data.product?.location}
                        onChange={handleProductChange}
                        className={`w-full px-4 py-2 rounded-md border ${errors['product?.location'] ? 'border-red-500' : 'border-gray-300'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      ></textarea>
                    </div>
                    
                  </div>
                </div>
              )}
              
              {/* Step 2: Documents */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-medium text-gray-800 pb-2 border-b border-gray-200">Product Documents</h2>

                  {/* File Inputs */}
                  {["certificate_of_incorporation", "kra_pin", "cr12_cr13", "signed_agreement"].map((fileKey) => (
                    <div key={fileKey} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 capitalize">{fileKey.replace(/_/g, " ")}</label>
                      <input
                        type="file"
                        name={fileKey}
                        onChange={handleProductChange}
                        className="mt-1 block w-full text-sm border border-gray-300 rounded-lg p-2"
                      />
                      {data.product[fileKey] && (
                        <div className="mt-2 flex items-center">
                          <span className="text-sm text-gray-600">{data.product[fileKey].name}</span>
                          <button 
                            type="button" 
                            onClick={() => removeFile(fileKey)}
                            className="ml-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Additional Documents */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Additional Documents</label>
                    <input
                      type="file"
                      name="additional_documents"
                      multiple
                      onChange={handleProductChange}
                      className="mt-1 block w-full text-sm border border-gray-300 rounded-lg p-2"
                    />
                    {data.product.additional_documents.length > 0 && (
                      <ul className="mt-2 text-sm text-gray-600">
                        {data.product.additional_documents.map((file, index) => (
                          <li key={index} className="flex justify-between items-center">
                            {file.name}
                            <button 
                              type="button" 
                              onClick={() => removeAdditionalFile(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              
              {/* Step 3: Admin User */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-3xl font-medium text-gray-800 pb-2 border-b border-gray-200">
                    <span>Admin User Information</span>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 text-yellow-800 text-sm mb-6">
                    <div className="flex">
                      <div>
                        <p className="font-medium">Important Note</p>
                        <p className="mt-1">This user will have administrator access to manage your product account.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">

                  <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin name <span className="text-red-500">*</span>
                      </label>

                      <input
                        type='text'
                        name='name'
                        value={data.user?.name} 
                        onChange={handleUserChange}
                        className={`min-w-full px-4 py-2 rounded-md border ${errors['user?.name'] ? 'border-red-500' : 'border-gray-300'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      />
                    </div>

                    <div className="mb-4 flex-1 flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Email <span className="text-red-500">*</span>
                      </label>

                      <input
                        type='email'
                        name='email'
                        value={data.user?.email} 
                        onChange={handleUserChange}
                        className={`min-w-full px-4 py-2 rounded-md border ${errors['user?.email'] ? 'border-red-500' : 'border-gray-300'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      />
                    </div>

                    <div className="mb-4 flex-1 flex-col">
                      <label htmlFor="admin-phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Phone <span className="text-red-400">*</span>
                      </label>

                      <PhoneInput
                        international
                        defaultCountry="US"
                        value={data.user?.phone}
                        onChange={(value) => setData("phone", value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {errors["user?.phone"] && (
                        <p className="text-red-500 text-xs mt-1">{errors["user?.phone"]}</p>
                      )}
                    </div>

                  </div>
                  
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-lg font-medium 
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
                    ) : "Register Product & Admin"}
                  </button>
                </div>
              )}
            </form>
            
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className='flex min-w-[90px]'>Previous Step</span>
                </button>
              )}
              
              {step < 3 && (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="ml-auto w-fit flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors"
                >
                  <span className='flex min-w-[70px]'>Next Step</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Create;