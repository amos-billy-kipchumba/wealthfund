<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Services\SmsService;

use Illuminate\Support\Str;
use App\Notifications\CustomVerifyEmail;


class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */

     protected $smsService;

     public function __construct(SmsService $smsService)
     {
         $this->smsService = $smsService;
     }

    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */

     public function store(Request $request): RedirectResponse
     {
         $request->validate([
             'name' => 'required|string|max:255',
             'role_id' => 'required',
             'staff_number'=> 'nullable',
             'phone' => 'required',
             'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
             'password' => ['required', 'confirmed', Rules\Password::defaults()],
         ]);
     
         $user = User::create([
             'name' => $request->name,
             'email' => $request->email,
             'phone' => $request->phone,
             'staff_number' => $request->staff_number ?? null,
             'role_id' => $request->role_id,
             'password' => Hash::make($request->password),
             'referral_number' => $request->referral_number
         ]);

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
     
         // Send email
     
         event(new Registered($user));
     
         Auth::login($user);

         $pass = $request->password;

         $user->notify(new CustomVerifyEmail($pass));
     
         return redirect(RouteServiceProvider::HOME);
     }

     private function sendSms($phone, $message)
     {
        $apiUrl = config('services.bulk_sms.api_url');
        $apiKey = config('services.bulk_sms.api_key');
        $senderId = config('services.bulk_sms.sender_id');

        $response = Http::post($apiUrl, [
            'apiKey' => $apiKey,
            'senderId' => $senderId,
            'message' => $message,
            'recipients' => $phone,
        ]);

        if ($response->failed()) {
            \Log::error('SMS sending failed', ['response' => $response->body()]);
        }
    }

    
}
