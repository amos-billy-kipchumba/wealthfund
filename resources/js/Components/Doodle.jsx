import React from "react";
import { Link } from "@inertiajs/react";

export default function Doodle({ title, value, icon = '', iconColor = '', descriptionValue = '', descriptionText = '', id, days }) {
    const iconBackgroundClass = `flex align-items-center justify-content-center bg-gray-100 border-round`;

    return (
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-xl text-blue-500 font-bold mb-3">{title}</span>
                        <div className="text-900 font-medium text-xl">Price: {value}</div>
                    </div>
                    <div className={iconBackgroundClass}
                         style={{width: '2.5rem', height: '2.5rem'}}>
                        <img
                          src={`/storage/${icon}`}
                          alt="ID Front"
                          className="w-full object-cover rounded-md"
                      />
                    </div>
                </div>

                <div>
                    <span className="text-green-500 font-medium">{ descriptionValue}</span>
                    <span className="text-500"> {descriptionText}</span>
                </div>

                <div className="mt-4 flex justify-between">
                    <Link 
                        href={route("assets.create", { id })} 
                        className="inline-block px-6 py-2 text-blue-500 bg-white border rounded-full hover:bg-blue-700 hover:text-white transition" 
                        style={{border: '1px solid blue'}}
                    >
                        Invest Now
                    </Link>

                    <p className="bg-purple-400 text-white flex items-center px-4 rounded-full text-xs">{days} days</p>
                </div>
            </div>
        </div>
    );
}
