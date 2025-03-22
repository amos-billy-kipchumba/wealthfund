import React, { useState } from 'react';

const Documents = ({ investor }) => {
    const [previews] = useState({
        id_front: investor?.id_front ? `/storage/${investor?.id_front}` : null,
        id_back: investor?.id_back ? `/storage/${investor?.id_back}` : null,
        passport_front: investor?.passport_front ? `/storage/${investor?.passport_front}` : null
    });

    return (
        <div className="flex flex-col justify-center">
            <div className="relative w-full">
                <div className="relative sm:rounded-3xl">
                    <div className="space-y-4">
                        {/* Investor Details */}
                        <div className="px-2">
                            <h3 className="text-xl font-semibold">Investor Details</h3>
                            <p><strong>ID Number:</strong> {investor.id_number}</p>
                            <p><strong>Passport Number:</strong> {investor.passport_number}</p>
                            <p><strong>Salary:</strong> {investor.salary}</p>
                            <p><strong>Asset Limit:</strong> {investor.asset_limit}</p>
                        </div>

                        {/* Document Previews */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            {previews.id_front && (
                                <div className="card relative flex flex-col">
                                    <img
                                        src={previews.id_front}
                                        alt="ID Front"
                                        className="w-full h-[20vh] object-cover rounded-md"
                                    />
                                    <p>ID front</p>
                                </div>
                            )}
                            {previews.id_back && (
                                <div className="card relative flex flex-col">
                                    <img
                                        src={previews.id_back}
                                        alt="ID Back"
                                        className="w-full h-[20vh] object-cover rounded-md"
                                    />
                                    <p>ID back</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documents;
