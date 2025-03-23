import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

            <div className="flex min-h-screen max-w-4xl mx-auto flex-col items-center justify-center py-[200px]">
                <img src="/images/logo.png" alt="hyper" className="h-14 mb-3" />
                <div className="w-full p-6 rounded-lg shadow-md">
                    <div className="text-center mb-5">
                        <h2 className="text-3xl font-medium text-gray-900 mb-3">Welcome Back</h2>
                        <p className="text-gray-600">
                            Don't have an account?
                            <Link href={route('register')} className="ml-2 text-blue-500 hover:underline">
                                Create today!
                            </Link>
                        </p>
                    </div>
                    <form onSubmit={submit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="text"
                                    placeholder="Email address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.email}
                                    required
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.password}
                                        required
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOffIcon className="h-8 w-8" /> : <EyeIcon className="h-8 w-8" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="rememberme-login"
                                        type="checkbox"
                                        className="h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <label htmlFor="rememberme-login" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-sm text-blue-500 hover:underline">
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
