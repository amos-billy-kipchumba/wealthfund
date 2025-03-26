
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/Layouts/layout/context/layoutcontext';
import Layout from "@/Layouts/layout/layout.jsx";
import Doodle from "@/Components/Doodle.jsx";
import { usePage, Link, Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const Dashboard = ({ auth }) => {
    // Get data from the page props
    const { productCount, activeAssetsCount, inactiveAssetsCount, pendingAssetsCount, pendingAssetsValue, repaidAssetsValue,activeAssetsValue, inactiveAssetsValue, assetTrends, repaymentTrends, investor, allProducts } = usePage().props;
    
    const [lineOptions, setLineOptions] = useState({});
    const { layoutConfig } = useContext(LayoutContext);
    const roleId = auth.user?.role_id;
    const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];

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

            {roleId === 3 &&
            <div className="grid pt-4">
                <div className="col-12 xl:col-6">
                    <h4>
                    Referral number: {auth.user?.unique_number}
                    </h4>
                </div>
            </div>}

            <div className="grid pt-4">
            {(allProducts && allProducts.length > 0) ? (
                allProducts.map((data) => (
                <Doodle
                    title={data.name}
                    value={`KES ${data.amount}`}
                    icon={data.logo}
                    iconColor="blue"
                    descriptionValue="Daily income:"
                    descriptionText={`KES ${data.payout}`}
                    id={data.id}
                    days={data.days}
                />
            ))
            ) : (
            <div>
                <h4>No product available</h4>
            </div>
            )}
            </div>

        </Layout>
    );
};

export default Dashboard;
