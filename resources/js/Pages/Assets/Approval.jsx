import React, { useState } from "react";
import { Link, useForm, router, Head, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import { Check, XCircle } from "lucide-react";
import Swal from "sweetalert2";

const Approval = ({ asset }) => {
    const [otp, setOtp] = useState("");
    const [status, setStatus] = useState("Approved");
    const [reason, setReason] = useState("");
    const { processing } = useForm();


   const { error } = usePage().props; 

    const handleStatusUpdate = (e, id) => {
        e.preventDefault();
        
        if (status === "Declined" && !reason.trim()) {
            Swal.fire("Error", "Please provide a reason for declining.", "error");
            return;
        }

        const formData = {
            status,
            id,
            otp,
            reason: status === "Declined" ? reason : "",
        };

        Swal.fire({
            title: `Are you sure you want to ${status.toLowerCase()} this asset?`,
            text: 'This action will update the asset status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: status === 'Approved' ? '#3085d6' : '#d33',
            cancelButtonColor: '#gray',
            confirmButtonText: `Yes, ${status.toLowerCase()} it!`,
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('assets.approveAsset', id), formData, {
                    onSuccess: () => {

                    },
                    onError: (err) => {
                        const errorMessage = err?.response?.data?.error || 'There was a problem updating the asset status.';
                        console.error(`${status} error:`, err);
                        Swal.fire('Error', errorMessage, 'error');
                    }
                });
            }
        });
    };

    return (
        <Layout>
            <Head title={asset.number} />
            <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Asset Details</h1>
                <div className="space-y-4">
                <div className="flex justify-between">
                        <strong className="text-gray-600">Asset Number:</strong>
                        <span className="text-gray-800">{asset.number}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Name:</strong>
                        <span className="text-gray-800">{asset.employee?.user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Principle:</strong>
                        <span className="text-gray-800">{asset.amount}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Asset Provider:</strong>
                        <span className="text-gray-800">{asset.asset_provider?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Email:</strong>
                        <span className="text-gray-800">{asset.employee?.user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Phone:</strong>
                        <span className="text-gray-800">{asset.employee?.user?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Current balance:</strong>
                        <span className="text-gray-800">{asset.currentBalance}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Asset due:</strong>
                        <span className="text-gray-800">{asset.eventualPay}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Status:</strong>
                        <span className="text-gray-800">{asset.status}</span>
                    </div>
                </div>

                {asset.status === "Pending" && (
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Enter OTP:</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter 6-digit OTP"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                )}

                {asset.status === "Pending" && (
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Asset Approval:</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="status" value="Approved" checked={status === "Approved"} onChange={() => setStatus("Approved")} />
                                <span>Approve</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="status" value="Declined" checked={status === "Declined"} onChange={() => setStatus("Declined")} />
                                <span>Decline</span>
                            </label>
                        </div>
                    </div>
                )}
                
                {status === "Declined" && (
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Reason for Declining:</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Provide reason for declining the asset"
                        ></textarea>
                    </div>
                )}
                
                <div className="mt-8 text-left space-x-4">
                    <Link href={route("assets.index")} className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        Back to Assets
                    </Link>
                    {asset.status === "Pending" && (
                        <button
                            onClick={(e) => handleStatusUpdate(e, asset.id)}
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
                        >
                            <Check className="w-4 h-4 mr-2" /> Submit
                        </button>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Approval;
