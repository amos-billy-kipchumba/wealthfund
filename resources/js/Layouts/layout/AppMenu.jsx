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
                { label: 'Products', icon: 'pi pi-fw pi-building', to: route('products.index'), permissions: ['Index product'] },
                { label: 'Investors', icon: 'pi pi-fw pi-users', to: route('investors.index'), permissions: ['Index investor'] },
                { label: 'Wallet', icon: 'pi pi-fw pi-wallet', to: route('wallet'), permissions: ['Index asset'] },
                { label: 'Assets', icon: 'pi pi-fw pi-wallet', to: route('assets.index'), permissions: ['Index asset'] },
                { label: 'Active assets', icon: 'pi pi-fw pi-wallet', to: route('assets.index', { status: 'Approved' }), permissions: ['Index asset'] },
                { label: 'Paid assets', icon: 'pi pi-fw pi-wallet', to: route('assets.index', { status: 'Paid' }), permissions: ['Index asset'] },
                { label: 'Asset Providers', icon: 'pi pi-fw pi-briefcase', to: route('assetProviders.index'), permissions: ['Index assetProvider'] },
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
