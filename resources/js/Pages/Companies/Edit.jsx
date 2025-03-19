import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Link, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";

const EditCompany = ({ company, errors }) => {
  const { data, setData, post, processing } = useForm({
    name: company.name,
    registration_number: company.registration_number,
    industry: company.industry,
    sectors: company.sectors,
    county: company.county,
    sub_county: company.sub_county,
    location: company.location,
    address: company.address,
    email: company.email,
    phone: company.phone,
    percentage: company.percentage,
    loan_limit: company.loan_limit,
    unique_number: company.unique_number,
    certificate_of_incorporation: company.unique_number,
    kra_pin: company.kra_pin,
    cr12_cr13: company.cr12_cr13,
    signed_agreement: company.signed_agreement,
    additional_documents: company.additional_documents
  });

  // ✅ Handle file input change (single & multiple)
  const handleFileChange = (e, fieldName, multiple = false) => {
    const files = Array.from(e.target.files);
    setData(fieldName, multiple ? [...data[fieldName], ...files] : files);
  };

  // ✅ Handle file removal
  const handleRemoveFile = (fieldName, index) => {
    setData(fieldName, data[fieldName].filter((_, i) => i !== index));
  };

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append text fields
    Object.keys(data).forEach((key) => {
      if (!['certificate_of_incorporation', 'kra_pin', 'cr12_cr13', 'signed_agreement', 'additional_documents'].includes(key)) {
        formData.append(key, data[key]);
      }
    });

    // Append file fields
    ['certificate_of_incorporation', 'kra_pin', 'cr12_cr13', 'signed_agreement', 'additional_documents'].forEach((field) => {
      if (data[field]) { 
        formData.append(field, data[field]);
      }
    });    

    // ✅ Tell Laravel this is a PUT request
    formData.append('_method', 'PUT');

    // ✅ Use `post` to send files while simulating a `PUT`
    router.post(route('companies.update', { company: company.id }), formData, {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  const additionalDocuments = (() => {
    try {
      return company.additional_documents ? JSON.parse(company.additional_documents) : [];
    } catch (error) {
      console.error("Invalid JSON format for additional documents:", error);
      return [];
    }
  })();

  return (
    <Layout>
      <Head title="Edit company" />
      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1>Edit Company</h1>
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Text Inputs */}
          {['name', 'registration_number', 'industry', 'sectors', 'county', 'sub_county', 'location', 'address', 'email', 'phone', 'percentage', 'loan_limit', 'unique_number'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {field.replace('_', ' ').toUpperCase()}
              </label>
              <input
                type="text"
                value={data[field]}
                onChange={(e) => setData(field, e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors[field] && <div className="text-sm text-red-500 mt-1">{errors[field]}</div>}
            </div>
          ))}

          {/* File Uploads */}
          {['certificate_of_incorporation', 'kra_pin', 'cr12_cr13', 'signed_agreement'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {field.replace('_', ' ').toUpperCase()}
              </label>
              <input
                type="file"
                name={field}
                multiple
                onChange={(e) => handleFileChange(e, field, true)}
                className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {/* Show selected files */}
              {data[field] && (
                <div className="mt-2 flex justify-between items-center border p-2 rounded-md">
                  <span className="text-sm">{data[field].name}</span>
                  <button
                    type="button"
                    onClick={() => setData(field, null)} 
                    className="text-red-500 text-xs ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}
              {errors[field] && <div className="text-sm text-red-500 mt-1">{errors[field]}</div>}
            </div>
          ))}

          {/* Additional Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Documents</label>
            <input
              type="file"
              name="additional_documents"
              multiple
              onChange={(e) => handleFileChange(e, 'additional_documents', true)}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {/* Show selected files */}

            {errors.additional_documents && (
              <div className="text-sm text-red-500 mt-1">{errors.additional_documents}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={processing}
          >
            {processing ? 'Saving...' : 'Save'}
          </button>
        </form>
        <Link href={route('companies.index')} className="mt-4 inline-block text-sm text-blue-600">
          Back to Companies
        </Link>
      </div>
    </Layout>
  );
};

export default EditCompany;
