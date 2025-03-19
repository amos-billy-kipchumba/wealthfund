<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Loan;
use App\Models\Employee;
use App\Models\Repayment;
use App\Models\Remittance;
use Illuminate\Support\Facades\Hash;

use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Mail;

use Illuminate\Support\Facades\Http;

use App\Services\SmsService;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;



class CompanyController extends Controller
{

    protected $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function index(Request $request)
    {
        $query = Company::query();

        $user = Auth::user();

        if (!$user->hasPermissionTo('Index company')) {
            return Inertia::render('Auth/Forbidden');
        }
    
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'LIKE', "%$search%");
        }

        $query->orderBy('created_at', 'desc');
    
        $companies = $query->paginate(10);
    
        return Inertia::render('Companies/Index', [
            'companies' => $companies->items(),
            'pagination' => $companies,
            'flash' => session('flash'),
        ]);
    }

    public function search($uniqueNumber)
    {
        $company = Company::where('unique_number', $uniqueNumber)->first();
        
        if(!$company) {
            return Inertia::render('Auth/Register', [
                'company'=>$company,
                'er'=>'Sorry no company with such unique number exist!'
            ]);
        } else {
            return Inertia::render('Auth/Register', [
                'company'=>$company
            ]);
        }
    
    }
    

    public function create()
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create company')) {
            return Inertia::render('Auth/Forbidden');
        }

        return Inertia::render('Companies/Create');
    }
    

    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create company')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validatedData = $request->all();

        // Handle file uploads
        $fileFields = ['certificate_of_incorporation', 'kra_pin', 'cr12_cr13', 'signed_agreement'];
        $filePaths = [];
    
        foreach ($fileFields as $field) {
            if ($request->hasFile("company.$field")) {
                $file = $request->file("company.$field");
                $fileName = time() . '-' . $file->getClientOriginalName(); 
                $filePaths[$field] = $file->storeAs("company_documents", $fileName, "public");
            }
        }
    
        // Handle multiple additional documents
        $additionalDocs = [];
        if ($request->hasFile('company.additional_documents')) {
            foreach ($request->file('company.additional_documents') as $doc) {
                $fileName = time() . '-' . $doc->getClientOriginalName(); 
                $additionalDocs[] = $doc->storeAs("company_documents", $fileName, "public");
            }
        }
    
        // Create the company record
        $company = Company::create([
            'name' => $validatedData['company']['name'],
            'industry' => $validatedData['company']['industry'],
            'address' => $validatedData['company']['address'],
            'email' => $validatedData['company']['email'],
            'phone' => $validatedData['company']['phone'],
            'percentage' => $validatedData['company']['percentage'],
            'loan_limit' => $validatedData['company']['loan_limit'],
            'registration_number' => $validatedData['company']['registration_number'],
            'sectors' => $validatedData['company']['sectors'],
            'county' => $validatedData['company']['county'],
            'sub_county' => $validatedData['company']['sub_county'],
            'location' => $validatedData['company']['location'],
            'certificate_of_incorporation' => $filePaths['certificate_of_incorporation'] ?? null,
            'kra_pin' => $filePaths['kra_pin'] ?? null,
            'cr12_cr13' => $filePaths['cr12_cr13'] ?? null,
            'signed_agreement' => $filePaths['signed_agreement'] ?? null,
            'additional_documents' => json_encode($additionalDocs), 
        ]);
    
        // Generate a random password
        $pass = Str::random(6);
    
        // Create the associated user
        $user = User::create([
            'name' => $validatedData['user']['name'],
            'phone' => $validatedData['phone'],
            'email' => $validatedData['user']['email'],
            'password' => Hash::make($pass),
            'company_id' => $company->id,
            'role_id' => 2, 
        ]);

        // Assign Role and Sync Permissions

        if ($user->role_id) {
            $role = Role::find($user->role_id);


            if ($role) {
                $user->assignRole($role);
                
                DB::table('model_has_roles')->where('model_id', $user->id)->update([
                    'model_type' => User::class
                ]);
            
                $user->syncPermissions($role->permissions);
            
                DB::table('model_has_permissions')->where('model_id', $user->id)->update([
                    'model_type' => User::class
                ]);
            }
            
        }

        
    
        // Send Email Notification
        Mail::to($user->email)->send(new WelcomeMail($user, $pass));
    
        // Send SMS Notification
        $this->smsService->sendSms(
            $user->phone, 
            "Hello {$user->name}, welcome to Nyotafund Limited! This is your login password: {$pass}"
        );
    
        return redirect()->route('companies.index')->with('success', 'Company created successfully.');
    }


    public function show(Request $request, Company $company)
    {

        $user = Auth::user();

        if (!$user->hasPermissionTo('View company')) {
            return Inertia::render('Auth/Forbidden');
        }

        $search = $request->query('search');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Ensure both dates are not null and not empty
        $filterByDate = !empty($startDate) && !empty($endDate);

        // Employees Filter
        $employees = Employee::with(['user', 'loans', 'company'])
            ->where('company_id', $company->id)
            ->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                ->orWhere('email', 'LIKE', "%$search%");
            })
            ->when($filterByDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->orderBy('created_at', 'desc') // Order by latest
            ->paginate(5)
            ->withQueryString();

        // Loans Filter
        $loans = Loan::with(['loanProvider', 'employee.user', 'employee.company'])
            ->whereHas('employee', function ($q) use ($search, $company) {
                $q->where('company_id', $company->id)
                ->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%$search%")
                        ->orWhere('email', 'LIKE', "%$search%")
                        ->orWhere('phone', 'LIKE', "%$search%");
                });
            })
            ->when($filterByDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->orderBy('created_at', 'desc') // Order by latest
            ->paginate(5)
            ->withQueryString();

        // Remittances Filter
        $remittances = Remittance::with(['company'])
            ->where('company_id', $company->id)
            ->where('remittance_number', 'LIKE', "%$search%")
            ->when($filterByDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->orderBy('created_at', 'desc') // Order by latest
            ->paginate(5)
            ->withQueryString();

        // Repayments Filter
        $repayments = Repayment::with([
            'loan',
            'loan.loanProvider',
            'loan.employee.user',
            'loan.employee.company',
        ])
        ->whereHas('loan.employee.user', function ($q) use ($search, $company) {
            $q->where('company_id', $company->id);
        })
        ->when($filterByDate, function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        })
        ->orderBy('created_at', 'desc') // Order by latest
        ->paginate(5)
        ->withQueryString();

        return Inertia::render('Companies/Show', [
            'company' => $company,
            'employees' => $employees,
            'loans' => $loans,
            'remittances' => $remittances,
            'repayments' => $repayments
        ]);
    }

    
    
    public function edit(Company $company)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit company')) {
            return Inertia::render('Auth/Forbidden');
        }
        
        return Inertia::render('Companies/Edit', [
            'company' => $company,
        ]);
    }


    public function update(Request $request, Company $company)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit company')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validatedData = $request->all();
    
        // File fields that need to be handled
        $fileFields = ['certificate_of_incorporation', 'kra_pin', 'cr12_cr13', 'signed_agreement'];
    
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                // Delete old file if it exists
                if ($company->$field) {
                    Storage::disk('public')->delete($company->$field);
                }
    
                // Store new file
                $file = $request->file($field);
                $fileName = time() . '-' . $file->getClientOriginalName();
                $validatedData[$field] = $file->storeAs("company_documents", $fileName, "public");
            }
        }
    
        // Handle multiple additional documents
        if ($request->hasFile('additional_documents')) {
            // Delete old additional documents if they exist
            if ($company->additional_documents) {
                foreach ($company->additional_documents as $doc) {
                    Storage::disk('public')->delete($doc);
                }
            }
    
            $additionalDocs = [];
            foreach ($request->file('additional_documents') as $doc) {
                $fileName = time() . '-' . $doc->getClientOriginalName();
                $additionalDocs[] = $doc->storeAs("company_documents", $fileName, "public");
            }
            $validatedData['additional_documents'] = $additionalDocs;
        }
    
        // Update company record
        $company->update($validatedData);
    
        return redirect()->route('companies.index')->with('success', 'Company updated successfully.');
    }

    public function destroy(Company $company)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Delete company')) {
            return Inertia::render('Auth/Forbidden');
        }

        $company->delete();

        return redirect()->route('companies.index')->with('success', 'Company deleted successfully.');
    }
}
