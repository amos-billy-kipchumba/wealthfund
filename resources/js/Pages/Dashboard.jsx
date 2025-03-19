
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/Layouts/layout/context/layoutcontext';
import Layout from "@/Layouts/layout/layout.jsx";
import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";
import { usePage, Link, Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const Dashboard = ({ auth }) => {
    // Get data from the page props
    const { companyCount, activeLoansCount, inactiveLoansCount, pendingLoansCount, pendingLoansValue, repaidLoansValue,activeLoansValue, inactiveLoansValue, loanTrends, repaymentTrends, employee, motherCompany } = usePage().props;
    
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
    if (!loanTrends || !repaymentTrends) {
        return <div>Loading...</div>;
    }

    const lineData = {
        labels: loanTrends.map(trend => trend.month),
        datasets: [
            {
                label: 'Salary advances',
                data: loanTrends.map(trend => trend.loan_count),
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
             {roleId === 2 && 
            <div className='flex gap-8 items-center'>
                <h4 className='font-bold flex items-center my-auto'>Company: {motherCompany?.name} - {motherCompany?.unique_number}</h4>
            </div>}

            {roleId === 3 && 
            <div className='flex gap-8 items-center'>
                <h4 className='font-bold flex items-center my-auto'>Phone number: {auth.user?.phone}</h4>
                {userPermission.includes('Create loan') &&
                <Link
                  href={route('loans.create')}
                  className="flex items-center mt-auto justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm min-w-fit"
                >
                  <Plus className="w-4 h-4 mr-2 my-auto" />
                  <span className='my-auto flex items-center'>
                  Request for an advance
                  </span>
                </Link>}
            </div>}

            <div className="grid pt-4">
                {roleId === 1 && 
                <DashboardInfoCard
                    title="Companies"
                    value={companyCount}
                    icon="map-marker"
                    iconColor="blue"
                    descriptionValue="Total Companies"
                    descriptionText="in the system"
                />}
                 {roleId === 3 && 
                <DashboardInfoCard
                    title="Salary"
                    value={new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(employee?.salary)}
                    icon="map-marker"
                    iconColor="blue"
                    descriptionValue="The salary"
                    descriptionText="you earn"
                />}
                {roleId === 3 && 
                <DashboardInfoCard
                    title="Salary advance limit"
                    value={new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(employee?.loan_limit)}
                    icon="map-marker"
                    iconColor="blue"
                    descriptionValue="The maximum amount"
                    descriptionText="you can borrow"
                />}
                <DashboardInfoCard
                    title="Active salary advances"
                    value={`${activeLoansCount} (${activeLoansValue})`}
                    icon="map-marker"
                    iconColor="orange"
                    descriptionValue="Active salary advances"
                    descriptionText="currently active"
                />
                <DashboardInfoCard
                    title="Pending salary advances"
                    value={`${pendingLoansCount} (${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(pendingLoansValue)})`}
                    icon="map-marker"
                    iconColor="orange"
                    descriptionValue="Active salary advances"
                    descriptionText="currently active"
                />
                <DashboardInfoCard
                    title="Declined salary advances"
                    value={`${inactiveLoansCount} (${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(inactiveLoansValue)})`}
                    icon="inbox"
                    iconColor="cyan"
                    descriptionValue="Inactive salary advances"
                    descriptionText="currently inactive"
                />
                <DashboardInfoCard
                    title="Repaid salary advances"
                    value={`${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(repaidLoansValue)}`}
                    icon="comment"
                    iconColor="purple"
                    descriptionValue="Total Repaid"
                    descriptionText="loan repayments"
                />
            </div>

            <div className="grid">
                <div className="col-12 xl:col-6">
                    <div className="card">
                        <h5>Salary advances and Repayment Trends</h5>
                        <Chart type="line" data={lineData} options={lineOptions} />
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Dashboard;
