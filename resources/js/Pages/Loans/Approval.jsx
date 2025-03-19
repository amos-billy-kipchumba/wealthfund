import React, { useState } from "react";
import { Link, useForm, router, Head, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import { Check, XCircle } from "lucide-react";
import Swal from "sweetalert2";

const Approval = ({ loan }) => {
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
            title: `Are you sure you want to ${status.toLowerCase()} this loan?`,
            text: 'This action will update the loan status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: status === 'Approved' ? '#3085d6' : '#d33',
            cancelButtonColor: '#gray',
            confirmButtonText: `Yes, ${status.toLowerCase()} it!`,
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('loans.approveLoan', id), formData, {
                    onSuccess: () => {

                    },
                    onError: (err) => {
                        const errorMessage = err?.response?.data?.error || 'There was a problem updating the loan status.';
                        console.error(`${status} error:`, err);
                        Swal.fire('Error', errorMessage, 'error');
                    }
                });
            }
        });
    };

    return (
        <Layout>
            <Head title={loan.number} />
            <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Loan Details</h1>
                <div className="space-y-4">
                <div className="flex justify-between">
                        <strong className="text-gray-600">Salary Advance Number:</strong>
                        <span className="text-gray-800">{loan.number}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Name:</strong>
                        <span className="text-gray-800">{loan.employee?.user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Principle:</strong>
                        <span className="text-gray-800">{loan.amount}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Salary Advance Provider:</strong>
                        <span className="text-gray-800">{loan.loan_provider?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Email:</strong>
                        <span className="text-gray-800">{loan.employee?.user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Phone:</strong>
                        <span className="text-gray-800">{loan.employee?.user?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Current balance:</strong>
                        <span className="text-gray-800">{loan.currentBalance}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Salary advance due:</strong>
                        <span className="text-gray-800">{loan.eventualPay}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Status:</strong>
                        <span className="text-gray-800">{loan.status}</span>
                    </div>
                </div>

                {loan.status === "Pending" && (
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

                {loan.status === "Pending" && (
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Salary Advance Approval:</label>
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
                            placeholder="Provide reason for declining the salary advance"
                        ></textarea>
                    </div>
                )}
                
                <div className="mt-8 text-left space-x-4">
                    <Link href={route("loans.index")} className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        Back to Loans
                    </Link>
                    {loan.status === "Pending" && (
                        <button
                            onClick={(e) => handleStatusUpdate(e, loan.id)}
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
