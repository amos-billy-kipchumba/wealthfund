<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use App\Models\Loan;
use App\Models\Employee;
use App\Models\Remittance;
use App\Models\Company;
use App\Models\Repayment;
use App\Models\LoanProvider;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Mail\LoanRequestMail;

use App\Mail\LoanApprovalMail;
use App\Mail\LoanDeclinedMail;
use Illuminate\Support\Facades\Mail;

use App\Mail\LoanRepaymentMail;
use App\Mail\LoanOtpMail;
use Carbon\Carbon;

use App\Services\MpesaService;
use Illuminate\Support\Facades\Log;

use App\Services\SmsService;
use Illuminate\Support\Str;

class LoanController extends Controller
{

    protected $mpesaService;
    protected $smsService;

    public function __construct(MpesaService $mpesaService = null, SmsService $smsService = null)
    {
        $this->mpesaService = $mpesaService;
        $this->smsService = $smsService;
    }
    
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Index loan')) {
            return Inertia::render('Auth/Forbidden');
        }

        $query = Loan::with(['employee.user', 'employee.company']);
    
        // Filter based on role
        if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $query->whereHas('employee.user', function ($q) use ($user) {
                $q->where('company_id', '=', $user->company_id);
            });
        } elseif ($user->role_id == 3) {
            $query->whereHas('employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
    
        // Filter by status
        if ($request->has('status')) {
            $status = $request->input('status');
            $query->where('status', $status);
        }
    
        // Search functionality
        if ($request->has('search')) {
            $search = trim($request->input('search'));
    
            $query->where(function ($q) use ($search) {
                // Direct loan fields
                $q->where('amount', 'LIKE', "%$search%")
                  ->orWhere('number', 'LIKE', "%$search%")
                  ->orWhere('status', 'LIKE', "%$search%");
    
                // Search within employee and related fields
                $q->orWhereHas('employee', function ($q) use ($search) {
                    $q->where('loan_limit', 'LIKE', "%$search%")
                      ->orWhereHas('user', function ($q) use ($search) {
                          $q->where('name', 'LIKE', "%$search%")
                            ->orWhere('email', 'LIKE', "%$search%");
                      })
                      ->orWhereHas('company', function ($q) use ($search) {
                          $q->where('name', 'LIKE', "%$search%");
                      });
                });
            });
        }

        $query->orderBy('created_at', 'desc');
    
        // Paginate results
        $loans = $query->paginate(10);
    
        return Inertia::render('Loans/Index', [
            'loans' => $loans->items(),
            'pagination' => $loans,
            'flash' => session('flash'),
            'params' => $request->all(), 
        ]);
    }
    
    
    

    public function create()
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create loan')) {
            return Inertia::render('Auth/Forbidden');
        }

        $employees = Employee::with(['user', 'loans'])->get()
            ->map(function ($employee) {
                return $employee->append('unpaid_loans_count', 'total_loan_balance');
            });
    
        $loanProviders = LoanProvider::all();
        $companies = Company::all();
    
        return Inertia::render('Loans/Create', [
            'employees' => $employees,
            'loanProviders' => $loanProviders,
            'companies' => $companies
        ]);
    }
    

    public function store(StoreLoanRequest $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create loan')) {
            return Inertia::render('Auth/Forbidden');
        }

        $loan = Loan::create($request->validated());
    
        if ($loan->status === 'Pending') {
            $employee = Employee::find($loan->employee_id); 
    
            if ($employee) {
                Mail::to($employee->user->email)->send(new LoanRequestMail($employee));
            }
        }

        return redirect()->route('loans.index')->with('success', 'Loan created successfully.');
    }

    public function bulkUpdate(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit loan')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validated = $request->validate([
            'loanIds' => 'required|array',
            'loanIds.*' => 'exists:loans,id',
        ]);
    
        $loanIds = $validated['loanIds'];
    
        DB::transaction(function () use ($loanIds) {
            $loans = Loan::with(['employee.company'])->whereIn('id', $loanIds)->get();
    
            foreach ($loans as $loan) {
            
                $loan->status = ($loan->currentBalance > 0 && $loan->currentBalance < $loan->amount)
                ? 'Pending Partially Paid'
                : 'Pending Paid';
                $loan->save();

                if ($loan->currentBalance > 0) {
                    // Generate a unique remittance number
                    $uniqueNumber = 'REM-' . time() . '-' . uniqid();
            
                    // Create the Remittance record
                    $remittance = Remittance::create([
                        'remittance_number' => $uniqueNumber,
                        'company_id' => $loan->employee->company->id ?? null,
                    ]);
            
                    // Create the Repayment record
                    $repayment = Repayment::create([
                        'loan_id' => $loan->id,
                        'amount' => $loan->currentBalance,
                        'remittance_id' => $remittance->id,
                        'payment_date' => Carbon::now()
                    ]);
            
                    // Load relationships for email
                    $repayment->load([
                        'loan',
                        'loan.loanProvider',
                        'loan.employee.user',
                        'loan.employee.company',
                    ]);
                }
            }
            
        });

        return redirect()->route('loans.index')->with('success', 'Loan paid successfully.');
    }

    public function handleMpesaCallback(Request $request)
    {
        // Log the callback received

        Log::info('M-Pesa B2C Callback:', ['response' => $request->all()]);

        // Decode JSON payload
        $content = json_decode($request->getContent(), true);

        // Extract and log transaction details
        if (isset($content['Result']['ResultParameters']['ResultParameter'])) {
            $transactionDetails = [];
            foreach ($content['Result']['ResultParameters']['ResultParameter'] as $row) {
                $transactionDetails[$row['Key']] = $row['Value'];
            }

            Log::info('Transaction Details:', $transactionDetails);
        } else {
            Log::error("Invalid M-Pesa Response Structure:", ['response' => $content]);
        }

        // Respond to M-Pesa to acknowledge the callback
        return response()->json(["B2CPaymentConfirmationResult" => "Success"]);
    }

    public function bulkRepayment(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit loan')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validated = $request->validate([
            'loanIds' => 'required|array',
            'loanIds.*' => 'exists:loans,id',
        ]);

        $loanIds = $validated['loanIds'];

        DB::transaction(function () use ($loanIds) {
            $loans = Loan::with(['employee.company'])->whereIn('id', $loanIds)->get();
    
            foreach ($loans as $loan) {

                $loan->status = ($loan->currentBalance > 0 && $loan->currentBalance < $loan->amount)
                ? 'Partially Paid'
                : 'Paid';
                $loan->save();
            
                $repayment = Repayment::where('loan_id', '=', $loan->id)->first();

                $repayment->update([
                    'status'=>'Paid'
                ]);
        
                // Load relationships for email
                $repayment->load([
                    'loan',
                    'loan.loanProvider',
                    'loan.employee.user',
                    'loan.employee.company',
                ]);
        
                // Send email notification
                Mail::to($repayment->loan->employee->user->email)
                    ->send(new LoanRepaymentMail($repayment));
            }
            
        });

        return redirect()->route('loans.index')->with('success', 'Loan paid successfully.');

    }     


    public function show(Loan $loan)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('View loan')) {
            return Inertia::render('Auth/Forbidden');
        }

        $loan->load(['employee.user', 'loanProvider']);

        return Inertia::render('Loans/Show', [
            'loan' => $loan,
        ]);
    }

    public function edit(Loan $loan)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit loan')) {
            return Inertia::render('Auth/Forbidden');
        }

        $employees = Employee::with(['user'])->get();
        $loanProviders = LoanProvider::all();

        return Inertia::render('Loans/Edit', [
            'loan' => $loan,
            'employees' => $employees,
            'loanProviders'=> $loanProviders
        ]);
    }

    public function update(UpdateLoanRequest $request, Loan $loan)
    {
    
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit loan')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validated = $request->validated();

        $oldStatus = $loan->status;
    
        $loan->load(['loanProvider', 'employee.user', 'employee.company']);
    
        // Update the loan with validated request data
        $loan->update($request->validated());
    
        // Send email notifications if the status has changed
        if ($loan->status !== $oldStatus) {
            if ($loan->status === 'Approved') {
                Mail::to($loan->employee->user->email)->send(new LoanApprovalMail($loan));

            } elseif ($loan->status === 'Declined') {
                $reason = $validated['reason'] ?? 'No reason provided';
                Mail::to($loan->employee->user->email)->send(new LoanDeclinedMail($loan, $reason));
            }
        }
        $reason = $validated['reason'] ?? 'No reason provided';
        Mail::to($loan->employee->user->email)->send(new LoanDeclinedMail($loan, $reason));
        return redirect()->route('loans.index')->with('success', 'Loan updated successfully.');
    }

    public function approveLoan(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit loan')) {
            return Inertia::render('Auth/Forbidden');
        }

        // Validate incoming request data
        $validated = $request->validate([
            'id' => 'required|exists:loans,id',
            'otp' => 'required|string',
            'status' => 'required|in:Approved,Declined',
            'reason' => 'nullable'
        ]);
    
        // Retrieve loan details
        $loan = Loan::find($validated['id']);
        $company = Company::find($user->company_id);
        
        // Now you have the result as an integer
        
    
        if (!$loan) {
            return redirect()->route('loans.index')->with('error', 'Loan not found.');
        }
    
        // Validate OTP
        if ($loan->otp !== $validated['otp']) {
            return Inertia::render('Loans/Approval', [
                'loan' => $loan,
                'error' => 'OTP is incorrect. Please try again.'
            ]);
        }else {
    
        $oldStatus = $loan->status;
    
        // Begin transaction to ensure data integrity
        DB::beginTransaction();
        try {
            // Update loan status
            $loan->update(['status' => $validated['status']]);
    
            // Handle status change events
            if ($loan->status !== $oldStatus) {
                if ($loan->status === 'Approved') {
                    $phone = $loan->employee->user->phone;

                            
                    // Get the loan amount and company percentage
                    $loanAmount = (float) $loan->amount;
                    $companyPercentage = (float) $company->percentage;
                    
                    // Calculate the amount to disburse
                    $amountToSend = (int) ($loanAmount - ($loanAmount * $companyPercentage / 100));
    
                    // Initiate M-Pesa Payment
                    $response = $this->mpesaService->sendB2CPayment($phone, $amountToSend);
                    Log::info('M-Pesa Response:', ['response' => $response]);
    
                    // Verify successful transaction before proceeding
                    if (!isset($response['ResponseCode']) || $response['ResponseCode'] !== "0") {
                        throw new \Exception('M-Pesa payment failed.');
                    }
    
                    // Send approval email
                    Mail::to($loan->employee->user->email)->send(new LoanApprovalMail($loan));
                
                } elseif ($loan->status === 'Declined') {
                    $reason = $validated['reason'] ?? 'No reason provided';
                    Mail::to($loan->employee->user->email)->send(new LoanDeclinedMail($loan, $reason));
                }
            }
    
            DB::commit();
            return redirect()->route('loans.index')->with('success', 'Salary advance updated successfully.');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Salary advance approval failed:', ['error' => $e->getMessage()]);
            return redirect()->route('loans.index')->with('error', 'Salary advance approval process failed.');
        }}
    }
    

    public function handleTimeout(Request $request)
    {
        Log::warning('M-Pesa Timeout Callback:', $request->all());

        return response()->json(['message' => 'Timeout callback received'], 200);
    }

    public function handleB2CCallback($request)
    {
        Log::info('B2C Callback Received: ', $request->all());

        $content = $request->json('Result.ResultParameters.ResultParameter', []);
        $data = [];

        foreach ($content as $row) {
            $data[$row['Key']] = $row['Value'];
        }

        return redirect()->route('loans.index')->with('success', 'Loan updated successfully.');
    }
    
    

    public function approve(UpdateLoanRequest $request, Loan $loan)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit loan')) {
            return Inertia::render('Auth/Forbidden');
        }

        $user = Auth::user();

        $otp = rand(100000, 999999);

        $loan->load(['loanProvider', 'employee.user', 'employee.company']);

        $loan->update([
            'otp'=>$otp
        ]);

        Mail::to($user->email)->send(new LoanOtpMail($otp, $loan->number));

        $this->smsService->sendSms(
            $user->phone, 
            "Hello {$user->name}, Your OTP for salary advance verification is: {$otp}"
        );

        return Inertia::render('Loans/Approval', [
            'loan' => $loan
        ]);
    }

    


    public function destroy(Loan $loan)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Delete loan')) {
            return Inertia::render('Auth/Forbidden');
        }

        $loan->delete();

        return redirect()->route('loans.index')->with('success', 'Loan deleted successfully.');
    }
}
