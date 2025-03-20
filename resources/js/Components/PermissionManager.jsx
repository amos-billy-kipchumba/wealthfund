import { useState, useEffect } from "react";
import { usePage, router } from '@inertiajs/react';
import { CheckCircle, Circle, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PermissionManager = ({ onUpdate }) => {
  const { permissions, user, auth } = usePage().props; 
  const permissionsList = permissions.map((data) => data.name);

  const roleId = auth.user?.role_id;

  // Array of permissions to exclude if roleId is 2
  const permissionsToExclude = ['Delete user', 'Index product', 'Create product', 'Edit product', 'Show product', 'View product', 'Export product', 'Delete product', 'Create employee', 'Delete employee', 'Create asset', 'Edit asset', 'Delete asset', 'Index asset provider', 'View asset provider', 'Create asset provider', 'Index asset provider', 'View asset provider', 'Edit asset provider', 'Delete asset provider', 'Export asset provider', 'Delete remittance', 'Create repayments', 'Edit repayments', 'Delete repayments']; 

  // Filter out specific permissions based on roleId using the exclusion array
  const filteredPermissions = roleId === 2
    ? permissions.filter(permission => !permissionsToExclude.includes(permission.name))
    : permissions;

  const filteredPermissionsList = filteredPermissions.map((data) => data.name);

  // Function to group permissions dynamically
  const groupPermissions = () => {
    const groups = {};
    filteredPermissionsList.forEach((perm) => {
      const parts = perm.split(" ");
      const action = parts[0];
      const entity = parts.slice(1).join(" "); 
      if (!groups[entity]) {
        groups[entity] = [];
      }
      groups[entity].push({ permission: perm, action });
    });
    return groups;
  };

  const permissionGroups = groupPermissions();
  const [formData, setFormData] = useState(user?.simple_permissions);
  const [expandedGroups, setExpandedGroups] = useState({});

  // Initialize all groups as expanded
  useEffect(() => {
    const initialExpandState = Object.keys(permissionGroups).reduce((acc, group) => {
      acc[group] = true;
      return acc;
    }, {});
    setExpandedGroups(initialExpandState);
  }, [filteredPermissionsList]);

  const handlePermissionChange = (permission) => {
    setFormData((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission) 
        : [...prev, permission] 
    );
  };
  
  const handleGroupToggle = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  // Toggle all permissions in a group
  const handleGroupSelectAll = (permissions, isAllSelected) => {
    if (isAllSelected) {
      // Remove all permissions in this group
      setFormData(prev => prev.filter(p => !permissions.includes(p)));
    } else {
      // Add all permissions in this group
      const permissionsToAdd = permissions.filter(p => !formData.includes(p));
      setFormData(prev => [...prev, ...permissionsToAdd]);
    }
  };

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  // Get action color based on type
  const getActionColor = (action) => {
    switch(action) {
      case 'View': return 'text-blue-600';
      case 'Create': return 'text-green-600';
      case 'Edit': return 'text-amber-600';
      case 'Delete': return 'text-red-600';
      case 'Export': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const handleSubmit = () => {
    router.post(`/update-permissions/${user.id}`, { permissions: formData }, {
      onSuccess: () => toast.success("Permissions updated successfully."),
    });
  };

  return (
    <div className="max-w-4xl bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden my-4">
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
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <div className="flex items-center space-x-2">
          <Shield className="text-white" size={24} />
          <h3 className="text-xl font-bold text-white">Permission Management</h3>
        </div>
        <p className="text-blue-100 text-sm mt-1">Configure access rights and capabilities for this user</p>
      </div>
      
      <div className="p-6">
        {Object.entries(permissionGroups).map(([group, perms]) => {
          const permissions = perms.map(p => p.permission);
          const isExpanded = expandedGroups[group];
          const selectedCount = permissions.filter(p => formData.includes(p)).length;
          const isAllSelected = selectedCount === permissions.length;
          
          return (
            <div key={group} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between bg-gray-50 px-4 py-3 cursor-pointer" 
                onClick={() => handleGroupToggle(group)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer ${isAllSelected ? '' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGroupSelectAll(permissions, isAllSelected);
                    }}
                  >
                    {isAllSelected ? 
                      <CheckCircle size={18} className="text-blue-600" /> : 
                      <Circle size={18} className="text-gray-400" />
                    }
                  </div>
                  <h4 className="font-medium text-gray-800 capitalize lg:min-w-[200px]">{group}</h4>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">{selectedCount} of {permissions.length} selected</span>
                  {isExpanded ? 
                    <ChevronUp size={18} className="text-gray-500" /> : 
                    <ChevronDown size={18} className="text-gray-500" />
                  }
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {perms.map(({ permission, action }) => (
                      <div 
                        key={permission} 
                        className={`relative flex items-center p-3 rounded-md transition-colors min-w-[45%] ${
                          formData.includes(permission) ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div 
                          className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer`}
                          onClick={() => handlePermissionChange(permission)}
                        >
                          {formData.includes(permission) ? 
                            <CheckCircle size={18} className="text-blue-600" /> : 
                            <Circle size={18} className="text-gray-400" />
                          }
                        </div>

                        <label htmlFor={permission} className="flex-1 cursor-pointer">
                          <span className={`font-medium ${getActionColor(action)}`}>{action}</span>
                          <span className="text-gray-700 ml-1">{group}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </div>
          );
        })}

          <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 my-4 mx-auto rounded">
            Update Permissions
          </button>
      </div>

    </div>
  );
};

export default PermissionManager;
