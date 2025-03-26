<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssetRequest;
use App\Http\Requests\UpdateAssetRequest;
use App\Models\Asset;
use App\Models\Investor;
use App\Models\Remittance;
use App\Models\Product;
use App\Models\Repayment;
use App\Models\AssetProvider;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Mail\AssetRequestMail;

use App\Mail\AssetApprovalMail;
use App\Mail\AssetDeclinedMail;
use Illuminate\Support\Facades\Mail;

use App\Mail\AssetRepaymentMail;
use App\Mail\AssetOtpMail;
use Carbon\Carbon;

use App\Services\MpesaService;
use Illuminate\Support\Facades\Log;

use App\Services\SmsService;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Http;

class AssetController extends Controller
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

        if (!$user->hasPermissionTo('Index asset')) {
            return Inertia::render('Auth/Forbidden');
        }

        $query = Asset::with(['investor.user', 'product']);
    
        // Filter based on role
        if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $query->whereHas('investor.user', function ($q) use ($user) {
                $q->where('product_id', '=', $user->product_id);
            });
        } elseif ($user->role_id == 3) {
            $query->whereHas('investor.user', function ($q) use ($user) {
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
                // Direct asset fields
                $q->where('amount', 'LIKE', "%$search%")
                  ->orWhere('number', 'LIKE', "%$search%")
                  ->orWhere('status', 'LIKE', "%$search%");
    
                // Search within investor and related fields
                $q->orWhereHas('investor', function ($q) use ($search) {
                    $q->where('asset_limit', 'LIKE', "%$search%")
                      ->orWhereHas('user', function ($q) use ($search) {
                          $q->where('name', 'LIKE', "%$search%")
                            ->orWhere('email', 'LIKE', "%$search%");
                      })
                      ->orWhereHas('product', function ($q) use ($search) {
                          $q->where('name', 'LIKE', "%$search%");
                      });
                });
            });
        }

        $query->orderBy('created_at', 'desc');
    
        // Paginate results
        $assets = $query->paginate(10);
    
        return Inertia::render('Assets/Index', [
            'assets' => $assets->items(),
            'pagination' => $assets,
            'flash' => session('flash'),
            'params' => $request->all(), 
        ]);
    }
    
    
    

    public function create()
    {
        $user = Auth::user();

        $id = request()->route('id');

        $product = Product::find($id);

        if (!$user->hasPermissionTo('Create asset')) {
            return Inertia::render('Auth/Forbidden');
        }

        $investors = Investor::with(['user', 'assets'])->get()
            ->map(function ($investor) {
                return $investor->append('unpaid_assets_count', 'total_asset_balance');
            });
    
        $assetProviders = AssetProvider::all();
        $products = Product::all();
    
        return Inertia::render('Assets/Create', [
            'investors' => $investors,
            'assetProviders' => $assetProviders,
            'products' => $products
        ]);
    }
    

    public function store(StoreAssetRequest $request)
    {
        $user = Auth::user();
    
        if (!$user->hasPermissionTo('Create asset')) {
            return Inertia::render('Auth/Forbidden');
        }
    
        $validatedData = $request->validated();

        $phone = $user->phone; // Default fallback

        // Convert +254 format to 07 format
        if (preg_match('/^\+254[7-9][0-9]{8}$/', $phone)) {
            $phone = '0' . substr($phone, 4); // Remove +254 and replace with 0
        }
    
        // Define the API URL
        $apiUrl = 'https://lipia-api.kreativelabske.com/api/request/stk';
    
        // Make STK Push request with authentication token
        $response = Http::withHeaders([
            'Authorization' => 'Bearer e0001c5c974c760d29eaef911ca8fe6552fc492f', // ✅ Fix: Added "Bearer "
            'Content-Type' => 'application/json',
        ])->post($apiUrl, [
            'phone' => $phone, 
            'amount' => $validatedData['amount'] ?? 100,
        ]);
    
        if ($response->successful()) {
            // Proceed to store the asset
            $asset = Asset::create($validatedData);
    
            return redirect()->route('assets.index')->with('success', 'Asset created successfully.');
        } else {
            // Handle failure and return error message from API
            return back()->with('error', 'Payment request failed: ' . $response->json('message', 'Unknown error'));
        }
    }


    public function bulkUpdate(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit asset')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validated = $request->validate([
            'assetIds' => 'required|array',
            'assetIds.*' => 'exists:assets,id',
        ]);
    
        $assetIds = $validated['assetIds'];
    
        DB::transaction(function () use ($assetIds) {
            $assets = Asset::with(['investor.product'])->whereIn('id', $assetIds)->get();
    
            foreach ($assets as $asset) {
            
                $asset->status = ($asset->currentBalance > 0 && $asset->currentBalance < $asset->amount)
                ? 'Pending Partially Paid'
                : 'Pending Paid';
                $asset->save();

                if ($asset->currentBalance > 0) {
                    // Generate a unique remittance number
                    $uniqueNumber = 'REM-' . time() . '-' . uniqid();
            
                    // Create the Remittance record
                    $remittance = Remittance::create([
                        'remittance_number' => $uniqueNumber,
                        'product_id' => $asset->investor->product->id ?? null,
                    ]);
            
                    // Create the Repayment record
                    $repayment = Repayment::create([
                        'asset_id' => $asset->id,
                        'amount' => $asset->currentBalance,
                        'remittance_id' => $remittance->id,
                        'payment_date' => Carbon::now()
                    ]);
            
                    // Load relationships for email
                    $repayment->load([
                        'asset',
                        'asset.assetProvider',
                        'asset.investor.user',
                        'asset.investor.product',
                    ]);
                }
            }
            
        });

        return redirect()->route('assets.index')->with('success', 'Asset paid successfully.');
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

        if (!$user->hasPermissionTo('Edit asset')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validated = $request->validate([
            'assetIds' => 'required|array',
            'assetIds.*' => 'exists:assets,id',
        ]);

        $assetIds = $validated['assetIds'];

        DB::transaction(function () use ($assetIds) {
            $assets = Asset::with(['investor.product'])->whereIn('id', $assetIds)->get();
    
            foreach ($assets as $asset) {

                $asset->status = ($asset->currentBalance > 0 && $asset->currentBalance < $asset->amount)
                ? 'Partially Paid'
                : 'Paid';
                $asset->save();
            
                $repayment = Repayment::where('asset_id', '=', $asset->id)->first();

                $repayment->update([
                    'status'=>'Paid'
                ]);
        
                // Load relationships for email
                $repayment->load([
                    'asset',
                    'asset.assetProvider',
                    'asset.investor.user',
                    'asset.investor.product',
                ]);
        
                // Send email notification
                Mail::to($repayment->asset->investor->user->email)
                    ->send(new AssetRepaymentMail($repayment));
            }
            
        });

        return redirect()->route('assets.index')->with('success', 'Asset paid successfully.');

    }     


    public function show(Asset $asset)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('View asset')) {
            return Inertia::render('Auth/Forbidden');
        }

        $asset->load(['investor.user', 'assetProvider']);

        return Inertia::render('Assets/Show', [
            'asset' => $asset,
        ]);
    }

    public function edit(Asset $asset)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit asset')) {
            return Inertia::render('Auth/Forbidden');
        }

        $investors = Investor::with(['user'])->get();
        $assetProviders = AssetProvider::all();

        return Inertia::render('Assets/Edit', [
            'asset' => $asset,
            'investors' => $investors,
            'assetProviders'=> $assetProviders
        ]);
    }

    public function update(UpdateAssetRequest $request, Asset $asset)
    {
    
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit asset')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validated = $request->validated();

        $oldStatus = $asset->status;
    
        $asset->load(['assetProvider', 'investor.user', 'investor.product']);
    
        // Update the asset with validated request data
        $asset->update($request->validated());
    
        // Send email notifications if the status has changed
        if ($asset->status !== $oldStatus) {
            if ($asset->status === 'Approved') {
                Mail::to($asset->investor->user->email)->send(new AssetApprovalMail($asset));

            } elseif ($asset->status === 'Declined') {
                $reason = $validated['reason'] ?? 'No reason provided';
                Mail::to($asset->investor->user->email)->send(new AssetDeclinedMail($asset, $reason));
            }
        }
        $reason = $validated['reason'] ?? 'No reason provided';
        Mail::to($asset->investor->user->email)->send(new AssetDeclinedMail($asset, $reason));
        return redirect()->route('assets.index')->with('success', 'Asset updated successfully.');
    }

    public function approveAsset(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit asset')) {
            return Inertia::render('Auth/Forbidden');
        }

        // Validate incoming request data
        $validated = $request->validate([
            'id' => 'required|exists:assets,id',
            'otp' => 'required|string',
            'status' => 'required|in:Approved,Declined',
            'reason' => 'nullable'
        ]);
    
        // Retrieve asset details
        $asset = Asset::find($validated['id']);
        $product = Product::find($user->product_id);
        
        // Now you have the result as an integer
        
    
        if (!$asset) {
            return redirect()->route('assets.index')->with('error', 'Asset not found.');
        }
    
        // Validate OTP
        if ($asset->otp !== $validated['otp']) {
            return Inertia::render('Assets/Approval', [
                'asset' => $asset,
                'error' => 'OTP is incorrect. Please try again.'
            ]);
        }else {
    
        $oldStatus = $asset->status;
    
        // Begin transaction to ensure data integrity
        DB::beginTransaction();
        try {
            // Update asset status
            $asset->update(['status' => $validated['status']]);
    
            // Handle status change events
            if ($asset->status !== $oldStatus) {
                if ($asset->status === 'Approved') {
                    $phone = $asset->investor->user->phone;

                            
                    // Get the asset amount and product percentage
                    $assetAmount = (float) $asset->amount;
                    $productPercentage = (float) $product->percentage;
                    
                    // Calculate the amount to disburse
                    $amountToSend = (int) ($assetAmount - ($assetAmount * $productPercentage / 100));
    
                    // Initiate M-Pesa Payment
                    $response = $this->mpesaService->sendB2CPayment($phone, $amountToSend);
                    Log::info('M-Pesa Response:', ['response' => $response]);
    
                    // Verify successful transaction before proceeding
                    if (!isset($response['ResponseCode']) || $response['ResponseCode'] !== "0") {
                        throw new \Exception('M-Pesa payment failed.');
                    }
    
                    // Send approval email
                    Mail::to($asset->investor->user->email)->send(new AssetApprovalMail($asset));
                
                } elseif ($asset->status === 'Declined') {
                    $reason = $validated['reason'] ?? 'No reason provided';
                    Mail::to($asset->investor->user->email)->send(new AssetDeclinedMail($asset, $reason));
                }
            }
    
            DB::commit();
            return redirect()->route('assets.index')->with('success', 'Asset updated successfully.');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Asset approval failed:', ['error' => $e->getMessage()]);
            return redirect()->route('assets.index')->with('error', 'Asset approval process failed.');
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

        return redirect()->route('assets.index')->with('success', 'Asset updated successfully.');
    }
    
    

    public function approve(UpdateAssetRequest $request, Asset $asset)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit asset')) {
            return Inertia::render('Auth/Forbidden');
        }

        $user = Auth::user();

        $otp = rand(100000, 999999);

        $asset->load(['assetProvider', 'investor.user', 'investor.product']);

        $asset->update([
            'otp'=>$otp
        ]);

        Mail::to($user->email)->send(new AssetOtpMail($otp, $asset->number));

        $this->smsService->sendSms(
            $user->phone, 
            "Hello {$user->name}, Your OTP for asset verification is: {$otp}"
        );

        return Inertia::render('Assets/Approval', [
            'asset' => $asset
        ]);
    }

    


    public function destroy(Asset $asset)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Delete asset')) {
            return Inertia::render('Auth/Forbidden');
        }

        $asset->delete();

        return redirect()->route('assets.index')->with('success', 'Asset deleted successfully.');
    }
}
