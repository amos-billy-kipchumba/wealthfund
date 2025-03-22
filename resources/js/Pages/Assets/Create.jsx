import React, {useState,useEffect} from 'react';
import { useForm, usePage, Link, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';  
import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Create = () => {
    const { investors, auth, products } = usePage().props; 
    const roleId = auth.user?.role_id;
    const [selectedInvestor, setSelectedInvestor] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const investorOptions = investors?.map(investor => ({
      value: investor.id,
      label: investor.user?.name
    }));

    const productOptions = products?.map(data => ({
        value: data.id,
        label: data.name
      }));

    const { data, setData, post, errors } = useForm({
      amount: '',
      status: 'Pending',
      disbursed_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      investor_id: '',
      asset_provider_id: 1,
      product_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const assetFloat = selectedInvestor?.asset_limit - selectedInvestor?.total_asset_balance;
        const amountToReceive = parseFloat(data.amount) - (parseFloat(data.amount) * (parseFloat(selectedProduct?.percentage) || 0) / 100);
    
        if (parseFloat(data.amount) > assetFloat) {
            toast.error("Advance amount cannot exceed the available advance float.");
            return;
        }
    
        if (amountToReceive < 100) {
            toast.error("Amount to receive must be at least 100 KES.");
            return;
        }
    
        post(route('assets.store'));
    };
    

    const handleInvestorChange = (selectedOption) => {
        setData('investor_id', selectedOption ? selectedOption.value : ''); 
    };

    const handleProductChange = (selectedOption) => {
        setData('product_id', selectedOption ? selectedOption.value : ''); 
    };

    useEffect(() => {
        if(roleId === 3) {
            const investor = investors.find(emp => emp.user_id === auth.user?.id);
            setSelectedInvestor(investor || null);
            setData((prev) => ({
                ...prev,
                investor_id: investor.id,
            }));
            
        }

        if(data.investor_id !== '') {
            const investor = investors.find(emp => emp.id === data.investor_id);
            setSelectedInvestor(investor || null);
        }

        if(data.product_id !== '') {
            const product = products.find(emp => emp.id === data.product_id);
            setSelectedProduct(product || null);
        }

        if(roleId !== 1) {
            const product = products.find(emp => emp.id === auth.user?.product_id);
            setSelectedProduct(product || null);
        }
    }, [investors, auth, data.investor_id, data.product_id]);

    return (
        <Layout>
           <Head title="Create advance" />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {selectedInvestor !== null && 
            <div className="grid">
                <DashboardInfoCard
                    title="Advance limit"
                    value={        new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(selectedInvestor.asset_limit)}
                    icon="map-marker"
                    iconColor="blue"
                    descriptionValue="The maximum amount"
                    descriptionText="you can borrow"
                />
                <DashboardInfoCard
                    title="Advance float"
                    value={ new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(selectedInvestor.asset_limit - selectedInvestor.total_asset_balance)}
                    icon="map-marker"
                    iconColor="blue"
                    descriptionValue="The amount"
                    descriptionText="you can still borrow"
                />
            </div>}
            <div className="max-w-full my-4 px-2">
                <h1 className="text-3xl font-semibold">Request for a asset</h1>
                <div className="grid gap-4">
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md mt-2">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            step="any"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {parseFloat(data.amount) > (selectedInvestor?.asset_limit - selectedInvestor?.total_asset_balance) && (
                            <div className="text-sm text-red-500 mt-1">
                                Asset amount cannot exceed the available advance float.
                            </div>
                        )}
                        {errors.amount && <div className="text-sm text-red-500 mt-1">{errors.amount}</div>}
                    </div>

                    {roleId !== 3 &&
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Investor</label>
                        <Select
                            options={investorOptions}
                            value={investorOptions.find(option => option.value === data.investor_id)} 
                            onChange={handleInvestorChange}
                            className="mt-1 block w-full py-2"
                            placeholder="Select a investor"
                        />
                        {errors.investor_id && <div className="text-sm text-red-500 mt-1">{errors.investor_id}</div>}
                    </div>}

                    {roleId === 1 &&
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product</label>
                        <Select
                            options={productOptions}
                            value={productOptions.find(option => option.value === data.product_id)} 
                            onChange={handleProductChange}
                            className="mt-1 block w-full py-2"
                            placeholder="Select a product"
                        />
                        {errors.investor_id && <div className="text-sm text-red-500 mt-1">{errors.investor_id}</div>}
                    </div>}

                    {/* Submit Button */}
                    {parseFloat(data.amount) <= (selectedInvestor?.asset_limit - selectedInvestor?.total_asset_balance) && (
                        <button
                            type="submit"
                            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Request for asset
                        </button>
                    )}
                </form>

                <div className='flex flex-col rounded-md border p-4 bg-white min-w-[250px]'>
                    <h2>Asset details</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center gap-4">
                            <strong className="text-gray-600">Amount to receive:</strong> 
                            <span className="text-gray-800 font-bold text-2xl">
                                {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(
                                    (parseFloat(data?.amount) || 0) - ((parseFloat(data?.amount) || 0) * (parseFloat(selectedProduct?.percentage) || 0) / 100)
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <strong className="text-gray-600">Amount to repay:</strong> 
                            <span className="text-gray-800 font-bold text-2xl">
                                {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(parseFloat(data?.amount) || 0)}
                            </span>
                        </div>
                    </div>
                </div>


                </div>

                {/* Link to Go Back */}
                <div className="mt-6 text-left">
                    <Link href={route('assets.index')} className="text-indigo-600 hover:text-indigo-800">
                        Back to assets
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Create;
