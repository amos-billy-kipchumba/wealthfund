import React from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

const ProcessedRequest = () => {
    const { user } = usePage().props; 


    return (
        <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
            <Head title="KYC submission" />
            <Head title="KYC submission" />
            
            <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                
                <div className="relative bg-white shadow-lg sm:rounded-3xl p-6">
                    <div className="flex justify-end mb-4">
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="text-sm px-4 py-2 bg-black text-white rounded-md hover:text-red-500 transition-colors"
                        >
                            Logout
                        </Link>
                    </div>

                    {user.status === 'Active' &&
                    <ol className="flex flex-col sm:flex-row justify-between text-sm font-medium text-gray-500 mb-6">
                        {[
                            { step: 1, label: 'Account setup', active: true },
                            { step: 2, label: 'KYC submission', active: true },
                            { step: 3, label: 'Verification & Approval', active: true }
                        ].map(({ step, label, active }) => (
                            <li 
                                key={step} 
                                className={`flex items-center space-x-2 ${active ? 'text-blue-600' : ''}`}
                            >
                                {active && <CheckCircle className="w-6 h-6" />}
                                <span>{step}. {label}</span>
                            </li>
                        ))}
                    </ol>}

                    {user.status === 'Active' &&
                    <div>
                        <p>Hi, {user.name}</p>
                        <p>Your approval is being processed!</p>
                        <p>We will send you an email once you are approved. Thank you!</p>
                    </div>}

                    {user.status === 'Deactivated' &&
                    <div>
                        <p>Hi, {user.name}</p>
                        <p>We regret to inform you that your account has been deactivated.</p>
                        <p>If you have any questions or need more information regarding this decision, feel free to reach out to us. We are happy to assist you in understanding the reasoning behind our decision.</p>
                        <p>We appreciate your understanding and thank you for your time and effort.</p>
                        <p>Best regards,</p>
                        <p><strong>The Nyotafund Team</strong></p>
                    </div>}

                </div>
            </div>
        </div>
    );
};

export default ProcessedRequest;