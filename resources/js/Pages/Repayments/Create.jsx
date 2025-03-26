import React, { useState } from 'react';
import { useForm, Link, usePage, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";

const Create = () => {
  const { withdrawalFloat, investor } = usePage().props;

  const { data, setData, post, errors } = useForm({
    amount: '',
    investor_id: investor ? investor.id : '',
    payment_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });

  const [alert, setAlert] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setData('amount', value);

    const amount = parseFloat(value);

    if (isNaN(amount) || amount < 100 || amount > withdrawalFloat) {
      setAlert(`Amount must be between 100 and ${withdrawalFloat}`);
    } else {
      setAlert('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (alert) return; // Prevent submission if validation fails
    post(route('repayments.store'));
  };

  return (
    <Layout>
      <Head title="Create repayment" />
      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-6">Enter amount you wish to withdraw</h1>
        
        {alert && <div className="text-sm text-red-500 mb-4">{alert}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              step="any"
              value={data.amount}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.amount && <div className="text-sm text-red-500 mt-1">{errors.amount}</div>}
          </div>

          <button
            type="submit"
            disabled={alert !== ''}
            className={`w-full mt-4 py-2 rounded-md focus:outline-none focus:ring-2 
              ${alert ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            Withdraw
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
