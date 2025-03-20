<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Providers\RouteServiceProvider;
use App\Mail\EmployeeApprovalMail;
use App\Mail\EmployeeDeclinedMail;
use App\Mail\DeactivatedMail;
use Illuminate\Support\Facades\Mail;

class EmployeeController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Index employee')) {
            return Inertia::render('Auth/Forbidden');
        }
    
        // Base query with eager loading
        $query = Employee::with('user', 'assets', 'product');
    
        // Filter by product if the user has role_id 2
        if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $query->where('product_id', '=', $user->product_id);
        }
    
        // Search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                  ->orWhere('email', 'LIKE', "%$search%");
            });
        }
    
        $query->orderBy('created_at', 'desc');

        // Paginate the results
        $employees = $query->paginate(10);
    
        // Append computed attributes to each employee
        $employees->getCollection()->transform(function ($employee) {
            $employee->append('unpaid_assets_count', 'total_asset_balance');
            return $employee;
        });
    
        // Return to Inertia view
        return Inertia::render('Employees/Index', [
            'employees' => $employees->items(),
            'pagination' => $employees,
            'flash' => session('flash'),
        ]);
    }
    

    public function getEmployeesByProduct(Request $request, $productId)
    {
        $user = Auth::user();

        // Ensure the user is authorized to view this data
        if ($user->role_id == 2 && $user->product_id != $productId) {
            abort(403, 'Unauthorized action.');
        }

        // Query employees belonging to the given product ID
        $query = Employee::with('user', 'assets', 'product')
                        ->where('product_id', $productId);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                ->orWhere('email', 'LIKE', "%$search%");
            });
        }

        $query->orderBy('created_at', 'desc');

        // Paginate the results
        $employees = $query->paginate(10);

        // Append computed attributes to each employee
        $employees->getCollection()->transform(function ($employee) {
            $employee->append('unpaid_assets_count', 'total_asset_balance');
            return $employee;
        });

        // Return to Inertia view
        return Inertia::render('Products/Show', [
            'employees' => $employees->items(),
            'pagination' => $employees,
            'flash' => session('flash'),
        ]);
    }

    
    

    public function create()
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create employee')) {
            return Inertia::render('Auth/Forbidden');
        }

        $products = Product::all();
        $users = User::all();
        return Inertia::render('Employees/Create', [
            'products' => $products,
            'users'=>$users
        ]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create employee')) {
            return Inertia::render('Auth/Forbidden');
        }

       $validatedData = $request->validated();
    
       $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];
       
       foreach ($fileFields as $field) {
           if ($request->hasFile($field)) {
               $file = $request->file($field);
               $path = $file->store('employee_documents', 'public');
               $validatedData[$field] = $path;
           }
       }
    
       $employee = Employee::create($validatedData);
    
       if ($user->role_id == "3") {
           $user->update([
               'product_id' => $employee->product_id,
               'kyc'=> 'Added'
           ]);
    
           $adminUser = Auth::user();

           if ($adminUser->role_id == "1") {
            return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
           }else {
            Auth::login($user);
    
            return redirect(RouteServiceProvider::HOME);
           }
       } else {
           return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
       }
    }

    public function show(Employee $employee)
    {

        $user = Auth::user();

        if (!$user->hasPermissionTo('View employee')) {
            return Inertia::render('Auth/Forbidden');
        }

        // Load related data
        $employee->load('user', 'product', 'assets');
    
        // Return data to the Inertia view
        return Inertia::render('Employees/Show', [
            'employee' => [
                'id' => $employee->id,
                'approved' => $employee->approved,
                'id_number'=>$employee->id_number,
                'id_front'=>$employee->id_front,
                'id_back'=>$employee->id_back,
                'passport_front'=>$employee->passport_front,
                'salary' => $employee->salary,
                'asset_limit' => $employee->asset_limit,
                'unpaid_assets_count' => $employee->unpaid_assets_count, 
                'total_asset_balance' => $employee->total_asset_balance,
            ],
            'user' => $employee->user,
            'product' => $employee->product,
        ]);
    }
    

    public function edit(Employee $employee)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit employee')) {
            return Inertia::render('Auth/Forbidden');
        }

        $products = Product::all();
        $users = User::all();
        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
            'products' => $products,
            'users'=>$users
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit employee')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validatedData = $request->validated();
        $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];
    
        $oldApprovedStatus = $employee->approved;
        $newApprovedStatus = $request->input('approved');
    
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                if ($employee->$field) {
                    \Storage::disk('public')->delete($employee->$field);
                }
                $file = $request->file($field);
                $path = $file->store('employee_documents', 'public');
                $validatedData[$field] = $path;
            }
        }
    
        $employee->update($validatedData);
    
        if ($oldApprovedStatus !== $newApprovedStatus) {
            if ($newApprovedStatus === 'Approved') {
                $employee->user->update([
                    'status'=>$validatedData['approved']
                ]);
                // Send approval email
                Mail::to($employee->user->email)->send(new EmployeeApprovalMail($employee));
            } elseif ($newApprovedStatus === 'Declined') {
                $employee->user->update([
                    'status'=>$validatedData['approved']
                ]);
                // Send declined email
                Mail::to($employee->user->email)->send(new EmployeeDeclinedMail($employee));
            } elseif ($newApprovedStatus === 'Deactivated') {
                $employee->user->update([
                    'status'=>$validatedData['approved']
                ]);
                // Send declined email
                Mail::to($employee->user->email)->send(new DeactivatedMail($employee));
            }
        }
    
        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }
    


    public function destroy(Employee $employee)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Delete employee')) {
            return Inertia::render('Auth/Forbidden');
        }

        $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];
    
        // Delete associated files
        foreach ($fileFields as $field) {
            if ($employee->$field) {
                \Storage::disk('public')->delete($employee->$field);
            }
        }
    
        $employee->delete();
    
        return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
    }
}
