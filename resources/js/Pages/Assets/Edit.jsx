import React, { useState, useEffect } from 'react';
import { useForm, usePage, Link, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';

const EditAsset = ({ errors }) => {
  const { asset, investors } = usePage().props; 

  const { data, setData, put, processing } = useForm({
    amount: asset.amount,
    status: asset.status,
    disbursed_at: asset.disbursed_at,
    investor_id: asset.investor_id,
    asset_provider_id: asset.asset_provider_id
  });


  const [selectedInvestor, setSelectedInvestor] = useState(null);

  useEffect(() => {
    if (asset.investor_id) {
      const defaultInvestor = investors.find((c) => c.id === asset?.investor_id);
      setSelectedInvestor(defaultInvestor);
    }
  }, [asset, investors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('assets.update', { asset: asset.id })); 
  };

  const handleInvestorChange = (selectedOption) => {
    setData('investor_id', selectedOption ? selectedOption.value : '');
    setSelectedInvestor(selectedOption);
  };

  return (
    <Layout>
      <Head title="Edit asset" />
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Edit asset</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                  type="number"
                  step="any"
                  value={data.amount}
                  onChange={(e) => setData('amount', e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.amount && <div className="text-sm text-red-500 mt-1">{errors.amount}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Investor</label>
            <Select
              value={selectedInvestor}
              onChange={handleInvestorChange}
              options={investors.map((investor) => ({
                value: investor.id,
                label: investor.user?.name
              }))}
              placeholder="Select a investor"
            />
            {errors.investor_id && <div className="text-sm text-red-500 mt-1">{errors.investor_id}</div>}
          </div>

          <button
            type="submit"
            className="w-full mt-4 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={processing}
          >
            {processing ? 'Saving...' : 'Save'}
          </button>
        </form>
        <Link href={route('assets.index')} className="mt-4 inline-block text-sm text-blue-600">Back to assets</Link>
      </div>
    </Layout>
  );
};

export default EditAsset;
