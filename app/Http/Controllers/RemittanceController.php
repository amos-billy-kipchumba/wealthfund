<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRemittanceRequest;
use App\Http\Requests\UpdateRemittanceRequest;
use App\Models\Remittance;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RemittanceController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Index remittance')) {
            return Inertia::render('Auth/Forbidden');
        }

        $query = Remittance::with('product');

        // Filter based on user role
        if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $query->whereHas('product', fn($q) => $q->where('id', $user->product_id));
        }

        // Search by product name only
        if ($request->has('search')) {
            $search = trim($request->input('search'));
            $query->whereHas('product', fn($q) => $q->where('name', 'LIKE', "%$search%"));
        }

        $remittances = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Remittances/Index', [
            'remittances' => $remittances->items(),
            'pagination' => $remittances,
            'flash' => session('flash'),
        ]);
    }

    public function create()
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create remittance')) {
            return Inertia::render('Auth/Forbidden');
        }

        return Inertia::render('Remittances/Create');
    }

    public function store(StoreRemittanceRequest $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create remittance')) {
            return Inertia::render('Auth/Forbidden');
        }

        Remittance::create($request->validated());

        return redirect()->route('remittances.index')->with('success', 'Remittance created successfully.');
    }

    public function show(Remittance $remittance)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('View remittance')) {
            return Inertia::render('Auth/Forbidden');
        }

        $remittance->load([
            'product', 
            'repayments.asset.investor.user'
        ]);
        
        $totalRepayments = $remittance->repayments->sum('amount');
    
        return Inertia::render('Remittances/Show', [
            'remittance' => $remittance,
            'totalRepayments' => $totalRepayments,
        ]);
    }
    
    
    public function edit(Remittance $remittance)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('View remittance')) {
            return Inertia::render('Auth/Forbidden');
        }

        return Inertia::render('Remittances/Edit', [
            'remittance' => $remittance,
        ]);
    }

    public function update(UpdateRemittanceRequest $request, Remittance $remittance)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Update remittance')) {
            return Inertia::render('Auth/Forbidden');
        }

        $remittance->update($request->validated());

        return redirect()->route('remittances.index')->with('success', 'Remittance updated successfully.');
    }

    public function destroy(Remittance $remittance)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Delete remittance')) {
            return Inertia::render('Auth/Forbidden');
        }

        $remittance->delete();

        return redirect()->route('remittances.index')->with('success', 'Remittance deleted successfully.');
    }
}
