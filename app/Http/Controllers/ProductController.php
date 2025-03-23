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
        $fileFields = ['logo'];
        $filePaths = [];
    
        foreach ($fileFields as $field) {
            if ($request->hasFile("product.$field")) {
                $file = $request->file("product.$field");
                $fileName = time() . '-' . $file->getClientOriginalName(); 
                $filePaths[$field] = $file->storeAs("product_documents", $fileName, "public");
            }
        }
    
        // Create the product record
        $product = Product::create([
            'name' => $validatedData['product']['name'],
            'amount' => $validatedData['product']['amount'],
            'days' => $validatedData['product']['days'],
            'payout' => $validatedData['product']['payout'],
            'logo' => $filePaths['logo'] ?? null
        ]);
    
        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }


    public function show(Request $request, Product $product)
    {

        $user = Auth::user();

        if (!$user->hasPermissionTo('View product')) {
            return Inertia::render('Auth/Forbidden');
        }

        return Inertia::render('Products/Show', [
            'product' => $product,
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
    

        $validatedData = $request->validate([
            'name' => 'nullable',
            'amount' => 'nullable',
            'days' => 'nullable',
            'payout' => 'nullable',
            'logo' => 'nullable',
        ]);

    
        if ($request->hasFile('logo')) {
            if ($product->logo) {
                Storage::disk('public')->delete($product->logo);
            }

            $file = $request->file('logo');
            $fileName = time() . '-' . $file->getClientOriginalName();
            $validatedData['logo'] = $file->storeAs("product_logos", $fileName, "public");
        }
    
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
