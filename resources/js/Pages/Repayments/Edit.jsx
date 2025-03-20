import React, { useState, useEffect } from 'react';
import { useForm, usePage, Link, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';

const EditRepayment = ({ errors }) => {
  const { repayment, assets } = usePage().props; 

  const { data, setData, put, processing } = useForm({
    asset_id: repayment.asset_id,
    amount: repayment.amount,
    payment_date: repayment.payment_date,
  });

  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    if (repayment.asset_id) {
      const defaultAsset = assets.find((c) => c.id === repayment?.asset_id);
      setSelectedAsset(defaultAsset);
    }
  }, [repayment, assets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('repayments.update', { repayment: repayment.id })); 
  };

  const handleAssetChange = (selectedOption) => {
    setData('asset_id', selectedOption ? selectedOption.value : '');
    setSelectedAsset(selectedOption);
  };

  return (
    <Layout>
      <Head title="Edit repayment" />
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Edit Repayment</h1>
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
            <label className="block text-sm font-medium text-gray-700">Asset</label>
            <Select
              value={selectedAsset}
              onChange={handleAssetChange}
              options={assets.map((asset) => ({
                value: asset.id,
                label: asset.number
              }))}
              placeholder="Select a asset"
            />
            {errors.asset_id && <div className="text-sm text-red-500 mt-1">{errors.asset_id}</div>}
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={processing}
          >
            {processing ? 'Saving...' : 'Save'}
          </button>
        </form>
        <Link href={route('repayments.index')} className="mt-4 inline-block text-sm text-blue-600">Back to Repayments</Link>
      </div>
    </Layout>
  );
};

export default EditRepayment;
