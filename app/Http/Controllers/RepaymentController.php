<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRepaymentRequest;
use App\Http\Requests\UpdateRepaymentRequest;
use App\Models\Repayment;
use App\Models\Asset;
use App\Models\Investor;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Mail\AssetRepaymentMail;
use Illuminate\Support\Facades\Mail;

class RepaymentController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Index repayments')) {
            return Inertia::render('Auth/Forbidden');
        }
    
        $query = Repayment::with([
            'investor.user',
            'investor.product'
        ]);
    
        // Filter based on role
        if ($user->role_id == 3) {
            $query->whereHas('investor.user', function ($q) use ($user) {
                $q->where('id', $user->id);
            });
        }
    
        // Search functionality
        if ($request->has('search')) {
            $search = trim($request->input('search'));
    
            $query->where(function ($q) use ($search) {
                $q->where('number', 'LIKE', "%$search%") 
                  ->orWhere('amount', 'LIKE', "%$search%") 
                  ->orWhereHas('investor', function ($q) use ($search) { 
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
    
        $repayments = $query->paginate(10);
    
        return Inertia::render('Repayments/Index', [
            'repayments' => $repayments->items(),
            'pagination' => $repayments,
            'flash' => session('flash'),
        ]);
    }
    
    

    public function create()
    {
        $user = Auth::user();

        $investor = Investor::where('user_id','=', $user->id)->first();

        if (!$user->hasPermissionTo('Create repayments')) {
            return Inertia::render('Auth/Forbidden');
        }

        $assets = Asset::all();

        $activeAssetsQuery = Asset::with(['assetProvider', 'investor.user', 'investor.product'])
        ->where('status', '=', 'Approved');

        $activeAssets = $activeAssetsQuery->get();

        $withdrawalFloat = $activeAssets->sum(function ($asset) {
            return $asset->withdrawalFloat;
        });

        return Inertia::render('Repayments/Create', [
            'assets' => $assets,
            'withdrawalFloat'=> $withdrawalFloat,
            'investor'=>$investor
        ]);
    }

    public function store(StoreRepaymentRequest $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create repayments')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validatedData = $request->validated();

        $validatedData['status'] = 'Pending';

        // Create repayment and load related data
        $repayment = Repayment::create($validatedData);
    
        // Ensure related data is loaded
        $repayment->load([
          'investor.user',
          'investor.product'
        ]);
    
        // Send the repayment email
        Mail::to($repayment->investor->user->email)
            ->send(new AssetRepaymentMail($repayment));
    
        return redirect()->route('repayments.index')->with('success', 'Repayment created successfully.');
    }

    public function updateStatus(Request $request)
    {
        $user = Auth::user();
    
        if (!$user->hasPermissionTo('Edit repayments')) {
            return Inertia::render('Auth/Forbidden');
        }
    
        $validated = $request->validate([
            'repaymentIds' => 'required|array',
            'repaymentIds.*' => 'exists:repayments,id', 
        ]);

        Repayment::whereIn('id', $validated['repaymentIds'])->update(['status' => 'Paid']);
    
        return redirect()->route('repayments.index')->with('success', 'Repayments updated to paid successfully.');
    }
    

    public function show(Repayment $repayment)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('View repayments')) {
            return Inertia::render('Auth/Forbidden');
        }

        $repayment->load([
          'investor.user',
          'investor.product'
        ]);

        return Inertia::render('Repayments/Show', [
            'repayment' => $repayment,
        ]);
    }

    public function edit(Repayment $repayment)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit repayments')) {
            return Inertia::render('Auth/Forbidden');
        }

        $assets = Asset::all();

        return Inertia::render('Repayments/Edit', [
            'repayment' => $repayment,
            'assets' => $assets,
        ]);
    }

    public function update(UpdateRepaymentRequest $request, Repayment $repayment)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit repayments')) {
            return Inertia::render('Auth/Forbidden');
        }

        $repayment->update($request->validated());

        return redirect()->route('repayments.index')->with('success', 'Repayment updated successfully.');
    }


    public function destroy(Repayment $repayment)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Delete repayments')) {
            return Inertia::render('Auth/Forbidden');
        }

        $repayment->delete();

        return redirect()->route('repayments.index')->with('success', 'Repayment deleted successfully.');
    }
}
