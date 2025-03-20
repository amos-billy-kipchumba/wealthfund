import React from 'react';
import { useForm, Link, usePage, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';  

const Create = () => {

   const { assets } = usePage().props; 

  const { data, setData, post, errors } = useForm({
    asset_id: '',
    amount: '',
    payment_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('repayments.store'));
  };

  const assetOptions = assets.map(asset => ({
    value: asset.id,
    label: asset.number
  }));

  const handleAssetChange = (selectedOption) => {
      setData('asset_id', selectedOption ? selectedOption.value : ''); 
  };

  return (
    <Layout>
      <Head title="Create repayment" />
      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-6">Create Repayment</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="amount"
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
                  options={assetOptions}
                  value={assetOptions.find(option => option.value === data.asset_id)} 
                  onChange={handleAssetChange}
                  className="mt-1 block w-full py-2"
                  placeholder="Select a asset"
              />
              {errors.asset_id && <div className="text-sm text-red-500 mt-1">{errors.asset_id}</div>}
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href={route('repayments.index')} className="text-indigo-600 hover:text-indigo-800">
            Back to Repayments
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Create;
