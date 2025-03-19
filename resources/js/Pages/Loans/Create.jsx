import React, {useState,useEffect} from 'react';
import { useForm, usePage, Link, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';  
import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Create = () => {
    const { employees, auth, companies } = usePage().props; 
    const roleId = auth.user?.role_id;
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const employeeOptions = employees?.map(employee => ({
      value: employee.id,
      label: employee.user?.name
    }));

    const companyOptions = companies?.map(data => ({
        value: data.id,
        label: data.name
      }));

    const { data, setData, post, errors } = useForm({
      amount: '',
      status: 'Pending',
      disbursed_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      employee_id: '',
      loan_provider_id: 1,
      company_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const loanFloat = selectedEmployee?.loan_limit - selectedEmployee?.total_loan_balance;
        const amountToReceive = parseFloat(data.amount) - (parseFloat(data.amount) * (parseFloat(selectedCompany?.percentage) || 0) / 100);
    
        if (parseFloat(data.amount) > loanFloat) {
            toast.error("Advance amount cannot exceed the available advance float.");
            return;
        }
    
        if (amountToReceive < 100) {
            toast.error("Amount to receive must be at least 100 KES.");
            return;
        }
    
        post(route('loans.store'));
    };
    

    const handleEmployeeChange = (selectedOption) => {
        setData('employee_id', selectedOption ? selectedOption.value : ''); 
    };

    const handleCompanyChange = (selectedOption) => {
        setData('company_id', selectedOption ? selectedOption.value : ''); 
    };

    useEffect(() => {
        if(roleId === 3) {
            const employee = employees.find(emp => emp.user_id === auth.user?.id);
            setSelectedEmployee(employee || null);
            setData((prev) => ({
                ...prev,
                employee_id: employee.id,
            }));
            
        }

        if(data.employee_id !== '') {
            const employee = employees.find(emp => emp.id === data.employee_id);
            setSelectedEmployee(employee || null);
        }

        if(data.company_id !== '') {
            const company = companies.find(emp => emp.id === data.company_id);
            setSelectedCompany(company || null);
        }

        if(roleId !== 1) {
            const company = companies.find(emp => emp.id === auth.user?.company_id);
            setSelectedCompany(company || null);
        }
    }, [employees, auth, data.employee_id, data.company_id]);

    return (
        <Layout>
           <Head title="Create advance" />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {selectedEmployee !== null && 
            <div className="grid">
                <DashboardInfoCard
                    title="Advance limit"
                    value={        new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(selectedEmployee.loan_limit)}
                    icon="map-marker"
                    iconColor="blue"
                    descriptionValue="The maximum amount"
                    descriptionText="you can borrow"
                />
                <DashboardInfoCard
                    title="Advance float"
                    value={ new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(selectedEmployee.loan_limit - selectedEmployee.total_loan_balance)}
                    icon="map-marker"
                    iconColor="blue"
                    descriptionValue="The amount"
                    descriptionText="you can still borrow"
                />
            </div>}
            <div className="max-w-full my-4 px-2">
                <h1 className="text-3xl font-semibold">Request for a salary advance</h1>
                <div className="grid gap-4">
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md mt-2">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            step="any"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {parseFloat(data.amount) > (selectedEmployee?.loan_limit - selectedEmployee?.total_loan_balance) && (
                            <div className="text-sm text-red-500 mt-1">
                                Loan amount cannot exceed the available advance float.
                            </div>
                        )}
                        {errors.amount && <div className="text-sm text-red-500 mt-1">{errors.amount}</div>}
                    </div>

                    {roleId !== 3 &&
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employee</label>
                        <Select
                            options={employeeOptions}
                            value={employeeOptions.find(option => option.value === data.employee_id)} 
                            onChange={handleEmployeeChange}
                            className="mt-1 block w-full py-2"
                            placeholder="Select a employee"
                        />
                        {errors.employee_id && <div className="text-sm text-red-500 mt-1">{errors.employee_id}</div>}
                    </div>}

                    {roleId === 1 &&
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <Select
                            options={companyOptions}
                            value={companyOptions.find(option => option.value === data.company_id)} 
                            onChange={handleCompanyChange}
                            className="mt-1 block w-full py-2"
                            placeholder="Select a company"
                        />
                        {errors.employee_id && <div className="text-sm text-red-500 mt-1">{errors.employee_id}</div>}
                    </div>}

                    {/* Submit Button */}
                    {parseFloat(data.amount) <= (selectedEmployee?.loan_limit - selectedEmployee?.total_loan_balance) && (
                        <button
                            type="submit"
                            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Request for salary advance
                        </button>
                    )}
                </form>

                <div className='flex flex-col rounded-md border p-4 bg-white min-w-[250px]'>
                    <h2>Salary advance details</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center gap-4">
                            <strong className="text-gray-600">Amount to receive:</strong> 
                            <span className="text-gray-800 font-bold text-2xl">
                                {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(
                                    (parseFloat(data?.amount) || 0) - ((parseFloat(data?.amount) || 0) * (parseFloat(selectedCompany?.percentage) || 0) / 100)
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <strong className="text-gray-600">Amount to repay:</strong> 
                            <span className="text-gray-800 font-bold text-2xl">
                                {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(parseFloat(data?.amount) || 0)}
                            </span>
                        </div>
                    </div>
                </div>


                </div>

                {/* Link to Go Back */}
                <div className="mt-6 text-left">
                    <Link href={route('loans.index')} className="text-indigo-600 hover:text-indigo-800">
                        Back to salary advances
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Create;
