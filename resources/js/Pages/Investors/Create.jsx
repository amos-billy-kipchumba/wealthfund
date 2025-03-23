import React from 'react';
import { useForm, usePage, Link, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';  

const Create = () => {
    const { products, users, auth } = usePage().props; 
    const roleId = auth.user?.role_id;

    const productOptions = products.map(product => ({
        value: product.id,
        label: product.name
    }));

    const userOptions = users.map(user => ({
      value: user.id,
      label: user.name
    }));

    const { data, setData, post, errors } = useForm({
      salary: '',
      asset_limit: '',
      user_id: '',
      product_id: roleId === 2 ? auth.user?.product_id : '',
      approved: '',   
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('investors.store'));
    };

    const handleProductChange = (selectedOption) => {
        setData('product_id', selectedOption ? selectedOption.value : ''); 
    };

    const handleUserChange = (selectedOption) => {
        setData('user_id', selectedOption ? selectedOption.value : ''); 
    };

    const handleApprovalChange = (e) => {
        setData('approved', e.target.value);
    };

    return (
        <Layout>
            <Head title="Create investor" />
            <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-semibold mb-6">Create Investor</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Net Salary</label>
                        <input
                            type="number"
                            step="any"
                            value={data.salary}
                            onChange={(e) => {
                                const salary = parseFloat(e.target.value) || 0;
                                setData({
                                    ...data,
                                    salary: salary,
                                    asset_limit: (salary * 0.33).toFixed(2) // Setting 33% of salary as asset limit
                                });
                            }}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.salary && <div className="text-sm text-red-500 mt-1">{errors.salary}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Asset Limit (33% of Salary)</label>
                        <input
                            type="number"
                            value={data.asset_limit}
                            readOnly
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none"
                        />
                    </div>

                    {/* Product Select (React Select) */}
                    {roleId === 1 &&
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product</label>
                        <Select
                            options={productOptions}
                            value={productOptions.find(option => option.value === data.product_id)}  // Set selected option
                            onChange={handleProductChange}
                            className="mt-1 block w-full py-2 rounded-md focus:outline-none"
                            placeholder="Select a product"
                        />
                        {errors.product_id && <div className="text-sm text-red-500 mt-1">{errors.product_id}</div>}
                    </div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">User</label>
                        <Select
                            options={userOptions}
                            value={userOptions.find(option => option.value === data.user_id)} 
                            onChange={handleUserChange}
                            className="mt-1 w-full py-2 rounded-md focus:outline-none"
                            placeholder="Select a user"
                        />
                        {errors.user_id && <div className="text-sm text-red-500 mt-1">{errors.user_id}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Approved</label>
                        <select
                        value={data.approved}
                        onChange={handleApprovalChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                        <option value="">Select approval...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        </select>
                        {errors.approved && <div className="text-sm text-red-500 mt-1">{errors.approved}</div>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Create Investor
                    </button>
                </form>

                {/* Link to Go Back */}
                <div className="mt-6 text-center">
                    <Link href={route('investors.index')} className="text-indigo-600 hover:text-indigo-800">
                        Back to Investors
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Create;
