import React, {useState} from 'react';
import { Link, Head, usePage, useForm } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';
import { Check  } from 'lucide-react';
import PermissionManager from '@/Components/PermissionManager';

const Show = ({ user }) => {


    const { auth } = usePage().props; 
    
  const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];



    const roleId = auth.user?.role_id;
     const { processing } = useForm({
        status: ''
      });
    
  
    const {
      delete: destroy,
    } = useForm();

    const [userPermissions, setUserPermissions] = useState([]);

    const handlePermissionsUpdate = (updatedPermissions) => {
      setUserPermissions(updatedPermissions);
    };

    const handleDelete = (userId) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          // Use Inertia.delete for making the delete request
          destroy(route('users.destroy', userId), {
            onSuccess: () => {
            },
            onError: (err) => {
              console.error('Delete error:', err);
            },
          });
        }
      });
    };


  const handleActivatedUpdate = (e, id, activated) => {
    e.preventDefault();
    
    const formData = {
      _method: 'PUT', 
      status: activated,
      id: id
    };
  
    Swal.fire({
      title: `Are you sure you want to ${activated.toLowerCase()} this user?`,
      text: 'This action will update the user activated.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: activated === 'Activated' ? '#3085d6' : '#d33',
      cancelButtonColor: '#gray',
      confirmButtonText: `Yes, ${activated.toLowerCase()} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('users.update', id), formData, {
          onSuccess: () => {
            Swal.fire(
              `${activated}!`, 
              `The user has been ${activated.toLowerCase()}.`, 
              'success'
            );
          },
          onError: (err) => {
            console.error(`${activated} error:`, err);
            Swal.fire('Error', 'There was a problem updating the user approval.', 'error');
          }
        });
      }
    });
  };

  return (
    <Layout>
      <Head title={user.name} />
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">User Details</h1>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <strong className="text-gray-600">Name:</strong> 
            <span className="text-gray-800">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Role:</strong> 
            <span className="text-gray-800">{user.role_id ? `Role ID: ${user.role_id}` : 'Not assigned'}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Email:</strong> 
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Phone:</strong> 
            <span className="text-gray-800">{user.phone}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Product:</strong> 
            <span className="text-gray-800">{user.product ? user.product.name : 'No product assigned'}</span>
          </div>
        </div>

        <div className="mt-8 text-left flex gap-4">
          {userPermission.includes('Index user') &&
          <Link 
            href={route('users.index')} 
            className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            Back to Users
          </Link>}

           {userPermission.includes('Edit user') &&
           <Link
              href={route('users.edit', user.id)}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
            >
              Edit
            </Link>}
            {(user.status !== 'Activated' && userPermission.includes('Delete user') && user.status !== 'Approved') &&
              <button
                onClick={(e) => handleActivatedUpdate(e, user.id, 'Activated')}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-2" /> Activate
              </button>}
            {(user?.status !== 'Deactivated' && userPermission.includes('Delete user')) &&
              <button
                onClick={(e) => handleActivatedUpdate(e, user.id, 'Deactivated')}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-2" /> Deactivate
              </button>}
            {userPermission.includes('Delete user') &&
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDelete(user.id); 
              }}
              className="inline"
            >
              <button type="submit" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
                Delete
              </button>
            </form>}
        </div>
      </div>

      {(roleId === 1 || roleId === 2) &&
      <PermissionManager selectedPermissions={userPermissions} onUpdate={handlePermissionsUpdate} />}
    </Layout>
  );
};

export default Show;
