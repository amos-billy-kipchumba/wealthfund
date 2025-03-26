import React, {useState,useEffect} from 'react';
import { useForm, usePage, Link, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';  
import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Create = () => {
    const { investors, auth, products } = usePage().props; 
    const {url} = usePage()
    const roleId = auth.user?.role_id;
    const [selectedInvestor, setSelectedInvestor] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const getIdFromUrl = () => {
        const searchParams = new URLSearchParams(new URL(url, window.location.origin).search);
        return searchParams.get('id') || '';
    };
    
    const id = getIdFromUrl();

    const { data, setData, post, errors } = useForm({
      amount: '',
      status: 'Approved',
      disbursed_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      investor_id: '',
      asset_provider_id: 1,
      product_id: parseInt(id),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
    
        post(route('assets.store'));
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

        if(id) {
            const product = products.find(data => data.id === parseInt(id));
            setSelectedProduct(product || null);

            setData((prev) => ({
                ...prev,
                amount: product.amount
            }));
        }
    }, [investors, auth, data.investor_id, data.product_id, id]);

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
            <div className="max-w-full my-4 px-2">
                <h1 className="text-3xl font-semibold my-4">Invest in {selectedProduct?.name} asset</h1>
                <div className="grid gap-4">
                    <div className='flex flex-col rounded-md border p-4 bg-white min-w-[250px]'>
                        <h2 className='mb-4'>Asset details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center gap-4">
                                <strong className="text-gray-600">Amount to pay:</strong> 
                                <span className="text-gray-800 font-bold text-2xl">
                                    {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(parseFloat(selectedProduct?.amount) || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <strong className="text-gray-600">Amount to receive:</strong> 
                                <span className="text-gray-800 font-bold text-2xl">
                                    {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(
                                        parseFloat(selectedProduct?.payout * selectedProduct?.days) 
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <strong className="text-gray-600">Amount to receive daily:</strong> 
                                <span className="text-gray-800 font-bold text-2xl">
                                    {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(parseFloat(selectedProduct?.payout) || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <strong className="text-gray-600">Number of days:</strong> 
                                <span className="text-gray-800 font-bold text-2xl">
                                    {selectedProduct?.days}
                                </span>
                            </div>
                        </div>

                        {roleId === 3 &&
                        <form onSubmit={handleSubmit} className="space-y-6 mt-2 text-left flex flex-col">
                            <button
                                type="submit"
                                className="w-full mt-4 bg-indigo-600 text-white pt-1 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-auto"
                            >
                                Invest now
                            </button>
                        </form>}
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
