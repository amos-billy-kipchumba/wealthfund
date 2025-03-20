import React, { useState, useEffect } from 'react';
import { useForm, Link, Head, router, usePage } from '@inertiajs/react';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Guest from '@/Layouts/GuestLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const [showForm, setShowForm] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { product, er } = usePage().props; 
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        unique_number: '',
        staff_number: '',
        role_id: 3,
        phone: '',
        password_confirmation: '',
        product_id: product ? product.id : null,
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const searchProduct = () => {
        if (!data.unique_number) {
            toast.error('Please enter a product number');
            return;
        }

        setIsSearching(true);
        router.get(
            route('products.search', data.unique_number),
            {}
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    useEffect(() => {
        if (er) {
            toast.error(er, {
                duration: 4000,
                position: 'top-center',
            });
        }
    }, [er]);

    useEffect(() => {
        if (product) {
            setData('product_id', product.id);
            setShowForm(true)
        }
    }, [product]);

    const renderPasswordInput = (name, label, placeholder, showPass, setShowPass) => (
        <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className='text-red-400'>*</span>
            </label>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={showPass ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={data[name]}
                    onChange={(e) => setData(name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                    {showPass ? <EyeOff className="h-8 w-8 text-gray-400" /> : <Eye className="h-8 w-8 text-gray-400" />}
                </button>
            </div>
            {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <Guest>
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-48">
                <Head title="Register" />

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

                <div className="w-full max-w-4xl space-y-8">
                    <ol className="flex justify-between text-sm font-medium text-gray-500">
                        {[
                            { step: 1, label: 'Account', active: true },
                            { step: 2, label: 'KYC', active: false },
                            { step: 3, label: 'Verification', active: false }
                        ].map(({ step, label, active }) => (
                            <li 
                                key={step} 
                                className={`flex items-center space-x-2 ${active ? 'text-blue-600' : ''}`}
                            >
                                {active && <span className="flex items-center"><CheckCircle className="w-10 h-10" /></span>}
                                <span className="flex items-center">{step}.</span>
                                <span className="flex items-center">{label}</span>
                            </li>
                        ))}
                    </ol>

                    <div className="bg-white shadow-md rounded-lg p-8">
                        <h2 className="text-center text-3xl font-bold mb-6">{!product ? 'Enter your product unique number and search' : 'Proceed to set up your account'}</h2>
                        
                        <div className="mb-6">
                            <label htmlFor="unique_number" className="block text-sm font-medium text-gray-700 mb-2">
                                Product number
                            </label>
                            <div className="flex gap-4">
                                <input
                                    id="unique_number"
                                    type="text"
                                    value={data.unique_number}
                                    onChange={(e) => setData('unique_number', e.target.value)}
                                    placeholder="Enter product unique number"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={searchProduct}
                                    disabled={isSearching}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isSearching ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                            {errors.unique_number && (
                                <p className="text-red-500 text-xs mt-1">{errors.unique_number}</p>
                            )}
                        </div>

                        {showForm && (
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your name <span className='text-red-400'>*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your email <span className='text-red-400'>*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your phone number <span className='text-red-400'>*</span>
                                    </label>
                                    <PhoneInput
                                        international
                                        defaultCountry="US"
                                        value={data.phone}
                                        onChange={(value) => setData('phone', value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                {renderPasswordInput('password', 'Password', 'Enter your password', showPassword, setShowPassword)}
                                {renderPasswordInput('password_confirmation', 'Confirm Password', 'Confirm your password', showConfirmPassword, setShowConfirmPassword)}

                                <div>
                                    <label htmlFor="staff_number" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your staff number (not required)
                                    </label>
                                    <input
                                        id="staff_number"
                                        type="text"
                                        placeholder="Enter your staff number"
                                        value={data.staff_number}
                                        onChange={(e) => setData('staff_number', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div className="flex justify-end mb-4">
                                    <Link 
                                        href={route('login')} 
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Already registered?
                                    </Link>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    Register
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Guest>
    );
}