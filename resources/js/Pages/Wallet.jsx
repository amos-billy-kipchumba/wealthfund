
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/Layouts/layout/context/layoutcontext';
import Layout from "@/Layouts/layout/layout.jsx";
import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";
import { usePage, Head, Link } from '@inertiajs/react';

const Wallet = ({ auth }) => {
    // Get data from the page props
    const { productCount, activeAssetsCount, repaidAssetsValue,activeAssetsValue, assetTrends, repaymentTrends, withdrawalFloat, referrals } = usePage().props;
    
    const [lineOptions, setLineOptions] = useState({});
    const { layoutConfig } = useContext(LayoutContext);
    const roleId = auth.user?.role_id;

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
        setLineOptions(lineOptions);
    };


    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };
        setLineOptions(lineOptions);
    };

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    // Ensure data is available before rendering
    if (!assetTrends || !repaymentTrends) {
        return <div>Loading...</div>;
    }

    const lineData = {
        labels: assetTrends.map(trend => trend.month),
        datasets: [
            {
                label: 'Assets',
                data: assetTrends.map(trend => trend.asset_count),
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: 0.4
            },
            {
                label: 'Repayments',
                data: repaymentTrends.map(trend => trend.repayment_value),
                fill: false,
                backgroundColor: '#00bb7e',
                borderColor: '#00bb7e',
                tension: 0.4
            }
        ]
    };


    return (
        <Layout>
            <Head title="Dashboard" />

            <div className="grid pt-4">
                {roleId === 1 && 
                <DashboardInfoCard
                    title="Products"
                    value={productCount}
                    icon="map-marker"
                    iconColor="blue"
                    descriptionValue="Total Products"
                    descriptionText="in the system"
                />}
                <DashboardInfoCard
                    title="Active assets"
                    value={`${activeAssetsCount} (KES ${activeAssetsValue})`}
                    icon="map-marker"
                    iconColor="orange"
                    descriptionValue="Active assets"
                    descriptionText="currently active"
                />
                <DashboardInfoCard
                    title="Withdrawable float"
                    value={`KES ${withdrawalFloat}`}
                    icon="map-marker"
                    iconColor="orange"
                    descriptionValue="Least amount"
                    descriptionText="to withdraw is KES 100"
                />
                <DashboardInfoCard
                    title="Referrals"
                    value={`${referrals} (KES ${referrals * 20})`}
                    icon="map-marker"
                    iconColor="orange"
                    descriptionValue="Amount"
                    descriptionText="you get when you referring someone"
                />
            </div>


            <div className="grid my-2">
                {(roleId === 3 && withdrawalFloat >= 100) && 
                <div className="col-12 xl:col-6">
                    <Link
                    href={route('repayments.create')}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                    <span className='my-auto'>
                    Withdraw
                    </span>
                    </Link>
                </div>}
            </div>

            <div className="grid">
                <div className="col-12 xl:col-6">
                    <div className="card">
                        <h5>Assets and Repayment Trends</h5>
                        <Chart type="line" data={lineData} options={lineOptions} />
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Wallet;
