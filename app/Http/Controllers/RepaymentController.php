<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRepaymentRequest;
use App\Http\Requests\UpdateRepaymentRequest;
use App\Models\Repayment;
use App\Models\Asset;
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

        if (!$user->hasPermissionTo('Index repayment')) {
            return Inertia::render('Auth/Forbidden');
        }
    
        $query = Repayment::with([
            'asset',
            'asset.assetProvider',
            'asset.investor.user',
            'asset.investor.product',
        ]);
    
        // Filter based on role
        if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $query->whereHas('asset.investor.user', function ($q) use ($user) {
                $q->where('product_id', '=', $user->product_id);
            });
        } elseif ($user->role_id == 3) {
            $query->whereHas('asset.investor.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
    
        // Search functionality
        if ($request->has('search')) {
            $search = trim($request->input('search'));
    
            $query->where(function ($q) use ($search) {
                $q->where('number', 'LIKE', "%$search%") // Search the 'number' field
                  ->orWhere('amount', 'LIKE', "%$search%") // Repayment amount
                  ->orWhereHas('asset', function ($q) use ($search) { // Asset fields
                      $q->where('amount', 'LIKE', "%$search%")
                        ->orWhere('status', 'LIKE', "%$search%");
                  })
                  ->orWhereHas('asset.investor', function ($q) use ($search) { // Investor and related fields
                      $q->where('asset_limit', 'LIKE', "%$search%")
                        ->orWhereHas('user', function ($q) use ($search) { // User fields
                            $q->where('name', 'LIKE', "%$search%")
                              ->orWhere('email', 'LIKE', "%$search%");
                        })
                        ->orWhereHas('product', function ($q) use ($search) { // Product name
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

        if (!$user->hasPermissionTo('Create repayment')) {
            return Inertia::render('Auth/Forbidden');
        }

        $assets = Asset::all();

        return Inertia::render('Repayments/Create', [
            'assets' => $assets,
        ]);
    }

    public function store(StoreRepaymentRequest $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create repayment')) {
            return Inertia::render('Auth/Forbidden');
        }

        // Create repayment and load related data
        $repayment = Repayment::create($request->validated());
    
        // Ensure related data is loaded
        $repayment->load([
            'asset',
            'asset.assetProvider',
            'asset.investor.user',
            'asset.investor.product',
        ]);
    
        // Send the repayment email
        Mail::to($repayment->asset->investor->user->email)
            ->send(new AssetRepaymentMail($repayment));
    
        return redirect()->route('repayments.index')->with('success', 'Repayment created successfully.');
    }

    public function show(Repayment $repayment)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('View repayment')) {
            return Inertia::render('Auth/Forbidden');
        }

        $repayment->load([
            'asset',
            'asset.assetProvider',
            'asset.investor.user',
            'asset.investor.product'
        ]);

        return Inertia::render('Repayments/Show', [
            'repayment' => $repayment,
        ]);
    }

    public function edit(Repayment $repayment)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit repayment')) {
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

        if (!$user->hasPermissionTo('Edit repayment')) {
            return Inertia::render('Auth/Forbidden');
        }

        $repayment->update($request->validated());

        return redirect()->route('repayments.index')->with('success', 'Repayment updated successfully.');
    }


    public function destroy(Repayment $repayment)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Delete repayment')) {
            return Inertia::render('Auth/Forbidden');
        }

        $repayment->delete();

        return redirect()->route('repayments.index')->with('success', 'Repayment deleted successfully.');
    }
}
