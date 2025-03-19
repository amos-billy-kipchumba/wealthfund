import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { usePage } from '@inertiajs/react';

const AppMenu = () => {
    const { auth } = usePage().props;

    // Extract user permissions from all assigned roles
  const userPermissions = auth.user?.permissions?.map(perm => perm.name) || [];



    // Define the complete menu model
    const model = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: route('dashboard') }, // Always visible
                { label: 'Companies', icon: 'pi pi-fw pi-building', to: route('companies.index'), permissions: ['Index company'] },
                { label: 'Employees', icon: 'pi pi-fw pi-users', to: route('employees.index'), permissions: ['Index employee'] },
                { label: 'Salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index'), permissions: ['Index loan'] },
                { label: 'Pending salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Pending' }), permissions: ['Index loan'] },
                { label: 'Approved salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Approved' }), permissions: ['Index loan'] },
                { label: 'Declined salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Declined' }), permissions: ['Index loan'] },
                { label: 'Pending Paid salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Pending Paid' }), permissions: ['Index loan'] },
                { label: 'Paid salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Paid' }), permissions: ['Index loan'] },
                { label: 'Salary Advance Providers', icon: 'pi pi-fw pi-briefcase', to: route('loanProviders.index'), permissions: ['Index loanProvider'] },
                { label: 'Notifications', icon: 'pi pi-fw pi-bell', to: route('notifications.index'), permissions: ['Index notification'] },
                { label: 'Repayments', icon: 'pi pi-fw pi-dollar', to: route('repayments.index'), permissions: ['Index repayment'] },
                { label: 'Remittances', icon: 'pi pi-wallet', to: route('remittances.index'), permissions: ['Index remittance'] },
                { label: 'Users', icon: 'pi pi-fw pi-user', to: route('users.index'), permissions: ['Index user'] },
                { label: 'Profile', icon: 'pi pi-user', to: route('profile.edit'), permissions: ['Edit profile'] },
            ]
        },
    ];

    // Filter menu items based on the user's permissions (excluding dashboard)
    const filteredModel = model.map(section => ({
        ...section,
        items: section.items.filter(item => 
            !item.permissions || item.permissions.some(perm => userPermissions.includes(perm))
        ),
    })).filter(section => section.items.length > 0); 

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {filteredModel.map((item, i) => {
                    return !item?.separator ? 
                        <AppMenuitem item={item} root={true} index={i} key={item?.label} />
                     : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
