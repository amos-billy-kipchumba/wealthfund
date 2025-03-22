<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Asset;
use App\Models\Investor;
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



class ProductController extends Controller
{

    protected $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function index(Request $request)
    {
        $query = Product::query();

        $user = Auth::user();

        if (!$user->hasPermissionTo('Index product')) {
            return Inertia::render('Auth/Forbidden');
        }
    
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'LIKE', "%$search%");
        }

        $query->orderBy('created_at', 'desc');
    
        $products = $query->paginate(10);
    
        return Inertia::render('Products/Index', [
            'products' => $products->items(),
            'pagination' => $products,
            'flash' => session('flash'),
        ]);
    }

    public function search($uniqueNumber)
    {
        $product = Product::where('unique_number', $uniqueNumber)->first();
        
        if(!$product) {
            return Inertia::render('Auth/Register', [
                'product'=>$product,
                'er'=>'Sorry no product with such unique number exist!'
            ]);
        } else {
            return Inertia::render('Auth/Register', [
                'product'=>$product
            ]);
        }
    
    }
    

    public function create()
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create product')) {
            return Inertia::render('Auth/Forbidden');
        }

        return Inertia::render('Products/Create');
    }
    

    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create product')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validatedData = $request->all();

        // Handle file uploads
        $fileFields = ['certificate_of_incorporation', 'kra_pin', 'cr12_cr13', 'signed_agreement'];
        $filePaths = [];
    
        foreach ($fileFields as $field) {
            if ($request->hasFile("product.$field")) {
                $file = $request->file("product.$field");
                $fileName = time() . '-' . $file->getClientOriginalName(); 
                $filePaths[$field] = $file->storeAs("product_documents", $fileName, "public");
            }
        }
    
        // Handle multiple additional documents
        $additionalDocs = [];
        if ($request->hasFile('product.additional_documents')) {
            foreach ($request->file('product.additional_documents') as $doc) {
                $fileName = time() . '-' . $doc->getClientOriginalName(); 
                $additionalDocs[] = $doc->storeAs("product_documents", $fileName, "public");
            }
        }
    
        // Create the product record
        $product = Product::create([
            'name' => $validatedData['product']['name'],
            'industry' => $validatedData['product']['industry'],
            'address' => $validatedData['product']['address'],
            'email' => $validatedData['product']['email'],
            'phone' => $validatedData['product']['phone'],
            'percentage' => $validatedData['product']['percentage'],
            'asset_limit' => $validatedData['product']['asset_limit'],
            'registration_number' => $validatedData['product']['registration_number'],
            'sectors' => $validatedData['product']['sectors'],
            'county' => $validatedData['product']['county'],
            'sub_county' => $validatedData['product']['sub_county'],
            'location' => $validatedData['product']['location'],
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
            'product_id' => $product->id,
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
    
        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }


    public function show(Request $request, Product $product)
    {

        $user = Auth::user();

        if (!$user->hasPermissionTo('View product')) {
            return Inertia::render('Auth/Forbidden');
        }

        $search = $request->query('search');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Ensure both dates are not null and not empty
        $filterByDate = !empty($startDate) && !empty($endDate);

        // Investors Filter
        $investors = Investor::with(['user', 'assets', 'product'])
            ->where('product_id', $product->id)
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

        // Assets Filter
        $assets = Asset::with(['assetProvider', 'investor.user', 'investor.product'])
            ->whereHas('investor', function ($q) use ($search, $product) {
                $q->where('product_id', $product->id)
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
        $remittances = Remittance::with(['product'])
            ->where('product_id', $product->id)
            ->where('remittance_number', 'LIKE', "%$search%")
            ->when($filterByDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->orderBy('created_at', 'desc') // Order by latest
            ->paginate(5)
            ->withQueryString();

        // Repayments Filter
        $repayments = Repayment::with([
            'asset',
            'asset.assetProvider',
            'asset.investor.user',
            'asset.investor.product',
        ])
        ->whereHas('asset.investor.user', function ($q) use ($search, $product) {
            $q->where('product_id', $product->id);
        })
        ->when($filterByDate, function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        })
        ->orderBy('created_at', 'desc') // Order by latest
        ->paginate(5)
        ->withQueryString();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'investors' => $investors,
            'assets' => $assets,
            'remittances' => $remittances,
            'repayments' => $repayments
        ]);
    }

    
    
    public function edit(Product $product)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit product')) {
            return Inertia::render('Auth/Forbidden');
        }
        
        return Inertia::render('Products/Edit', [
            'product' => $product,
        ]);
    }


    public function update(Request $request, Product $product)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit product')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validatedData = $request->all();
    
        // File fields that need to be handled
        $fileFields = ['certificate_of_incorporation', 'kra_pin', 'cr12_cr13', 'signed_agreement'];
    
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                // Delete old file if it exists
                if ($product->$field) {
                    Storage::disk('public')->delete($product->$field);
                }
    
                // Store new file
                $file = $request->file($field);
                $fileName = time() . '-' . $file->getClientOriginalName();
                $validatedData[$field] = $file->storeAs("product_documents", $fileName, "public");
            }
        }
    
        // Handle multiple additional documents
        if ($request->hasFile('additional_documents')) {
            // Delete old additional documents if they exist
            if ($product->additional_documents) {
                foreach ($product->additional_documents as $doc) {
                    Storage::disk('public')->delete($doc);
                }
            }
    
            $additionalDocs = [];
            foreach ($request->file('additional_documents') as $doc) {
                $fileName = time() . '-' . $doc->getClientOriginalName();
                $additionalDocs[] = $doc->storeAs("product_documents", $fileName, "public");
            }
            $validatedData['additional_documents'] = $additionalDocs;
        }
    
        // Update product record
        $product->update($validatedData);
    
        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Delete product')) {
            return Inertia::render('Auth/Forbidden');
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}
