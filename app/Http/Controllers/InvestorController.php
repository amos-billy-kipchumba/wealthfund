<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvestorRequest;
use App\Http\Requests\UpdateInvestorRequest;
use App\Models\Investor;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Providers\RouteServiceProvider;
use App\Mail\InvestorApprovalMail;
use App\Mail\InvestorDeclinedMail;
use App\Mail\DeactivatedMail;
use Illuminate\Support\Facades\Mail;

class InvestorController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Index investor')) {
            return Inertia::render('Auth/Forbidden');
        }
    
        // Base query with eager loading
        $query = Investor::with('user', 'assets', 'product');
    
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
        $investors = $query->paginate(10);
    
        // Append computed attributes to each investor
        $investors->getCollection()->transform(function ($investor) {
            $investor->append('unpaid_assets_count', 'total_asset_balance');
            return $investor;
        });
    
        // Return to Inertia view
        return Inertia::render('Investors/Index', [
            'investors' => $investors->items(),
            'pagination' => $investors,
            'flash' => session('flash'),
        ]);
    }
    

    public function getInvestorsByProduct(Request $request, $productId)
    {
        $user = Auth::user();

        // Ensure the user is authorized to view this data
        if ($user->role_id == 2 && $user->product_id != $productId) {
            abort(403, 'Unauthorized action.');
        }

        // Query investors belonging to the given product ID
        $query = Investor::with('user', 'assets', 'product')
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
        $investors = $query->paginate(10);

        // Append computed attributes to each investor
        $investors->getCollection()->transform(function ($investor) {
            $investor->append('unpaid_assets_count', 'total_asset_balance');
            return $investor;
        });

        // Return to Inertia view
        return Inertia::render('Products/Show', [
            'investors' => $investors->items(),
            'pagination' => $investors,
            'flash' => session('flash'),
        ]);
    }

    
    

    public function create()
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create investor')) {
            return Inertia::render('Auth/Forbidden');
        }

        $products = Product::all();
        $users = User::all();
        return Inertia::render('Investors/Create', [
            'products' => $products,
            'users'=>$users
        ]);
    }

    public function store(StoreInvestorRequest $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create investor')) {
            return Inertia::render('Auth/Forbidden');
        }

       $validatedData = $request->validated();

       $validatedData['approved'] = 'Approved';
    
       $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];
       
       foreach ($fileFields as $field) {
           if ($request->hasFile($field)) {
               $file = $request->file($field);
               $path = $file->store('investor_documents', 'public');
               $validatedData[$field] = $path;
           }
       }
    
       $investor = Investor::create($validatedData);
    
       if ($user->role_id == "3") {
           $user->update([
               'product_id' => $investor->product_id,
               'kyc'=> 'Added'
           ]);
    
           $adminUser = Auth::user();

           if ($adminUser->role_id == "1") {
            return redirect()->route('investors.index')->with('success', 'Investor created successfully.');
           }else {
            Auth::login($user);
    
            return redirect(RouteServiceProvider::HOME);
           }
       } else {
           return redirect()->route('investors.index')->with('success', 'Investor created successfully.');
       }
    }

    public function show(Investor $investor)
    {

        $user = Auth::user();

        if (!$user->hasPermissionTo('View investor')) {
            return Inertia::render('Auth/Forbidden');
        }

        // Load related data
        $investor->load('user', 'product', 'assets');
    
        // Return data to the Inertia view
        return Inertia::render('Investors/Show', [
            'investor' => [
                'id' => $investor->id,
                'approved' => $investor->approved,
                'id_number'=>$investor->id_number,
                'id_front'=>$investor->id_front,
                'id_back'=>$investor->id_back,
                'passport_front'=>$investor->passport_front,
                'salary' => $investor->salary,
                'asset_limit' => $investor->asset_limit,
                'unpaid_assets_count' => $investor->unpaid_assets_count, 
                'total_asset_balance' => $investor->total_asset_balance,
            ],
            'user' => $investor->user,
            'product' => $investor->product,
        ]);
    }
    

    public function edit(Investor $investor)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit investor')) {
            return Inertia::render('Auth/Forbidden');
        }

        $products = Product::all();
        $users = User::all();
        return Inertia::render('Investors/Edit', [
            'investor' => $investor,
            'products' => $products,
            'users'=>$users
        ]);
    }

    public function update(UpdateInvestorRequest $request, Investor $investor)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit investor')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validatedData = $request->validated();
        $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];
    
        $oldApprovedStatus = $investor->approved;
        $newApprovedStatus = $request->input('approved');
    
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                if ($investor->$field) {
                    \Storage::disk('public')->delete($investor->$field);
                }
                $file = $request->file($field);
                $path = $file->store('investor_documents', 'public');
                $validatedData[$field] = $path;
            }
        }
    
        $investor->update($validatedData);
    
        if ($oldApprovedStatus !== $newApprovedStatus) {
            if ($newApprovedStatus === 'Approved') {
                $investor->user->update([
                    'status'=>$validatedData['approved']
                ]);
                // Send approval email
                Mail::to($investor->user->email)->send(new InvestorApprovalMail($investor));
            } elseif ($newApprovedStatus === 'Declined') {
                $investor->user->update([
                    'status'=>$validatedData['approved']
                ]);
                // Send declined email
                Mail::to($investor->user->email)->send(new InvestorDeclinedMail($investor));
            } elseif ($newApprovedStatus === 'Deactivated') {
                $investor->user->update([
                    'status'=>$validatedData['approved']
                ]);
                // Send declined email
                Mail::to($investor->user->email)->send(new DeactivatedMail($investor));
            }
        }
    
        return redirect()->route('investors.index')->with('success', 'Investor updated successfully.');
    }
    


    public function destroy(Investor $investor)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Delete investor')) {
            return Inertia::render('Auth/Forbidden');
        }

        $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];
    
        // Delete associated files
        foreach ($fileFields as $field) {
            if ($investor->$field) {
                \Storage::disk('public')->delete($investor->$field);
            }
        }
    
        $investor->delete();
    
        return redirect()->route('investors.index')->with('success', 'Investor deleted successfully.');
    }
}
