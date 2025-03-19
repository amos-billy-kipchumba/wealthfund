import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link } from '@inertiajs/react';

export default function Forbidden() {
    return (
        <GuestLayout>
            <Head title="Access Denied" />

            <div className='w-full flex flex-col min-h-screen'>
                <div className='w-full flex flex-col py-[200px] text-center'>

                    <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>

                    <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
                        You do not have the necessary permissions to access this page. If you believe this is an error, please contact your administrator.
                    </p>

                    <div className="mt-6">
                        <Link
                            href={route('dashboard')}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-indigo-700"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
