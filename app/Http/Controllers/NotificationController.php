<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use App\Models\Notification;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Index notification')) {
            return Inertia::render('Auth/Forbidden');
        }
    
        $query = Notification::with('user');
    
        if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('product_id', '=', $user->product_id);
            });
        } elseif ($user->role_id == 3) {
            $query->where('user_id', '=', $user->id);
        }
    
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                  ->orWhere('email', 'LIKE', "%$search%");
            });
        }

        $query->orderBy('created_at', 'desc');
    
        $notifications = $query->paginate(10);
    
        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications->items(),
            'pagination' => $notifications,
            'flash' => session('flash'),
        ]);
    }
    

    public function create()
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create notification')) {
            return Inertia::render('Auth/Forbidden');
        }

        $notifications = Notification::all();
        $users = User::all();

        return Inertia::render('Notifications/Create', [
            'notifications' => $notifications,
            'users'=> $users
        ]);
    }

    public function store(StoreNotificationRequest $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create notification')) {
            return Inertia::render('Auth/Forbidden');
        }

        Notification::create($request->validated());

        return redirect()->route('notifications.index')->with('success', 'Notification created successfully.');
    }


    public function show(Notification $notification)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('View notification')) {
            return Inertia::render('Auth/Forbidden');
        }

        return Inertia::render('Notifications/Show', [
            'notification' => $notification,
        ]);
    }

    public function edit(Notification $notification)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit notification')) {
            return Inertia::render('Auth/Forbidden');
        }

        $notifications = Notification::all();
        $users = User::all();

        return Inertia::render('Notifications/Edit', [
            'notification' => $notification,
            'notifications' => $notifications,
            'users'=>$users
        ]);
    }

    public function update(UpdateNotificationRequest $request, Notification $notification)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit notification')) {
            return Inertia::render('Auth/Forbidden');
        }

        $notification->update($request->validated());

        return redirect()->route('notifications.index')->with('success', 'Notification updated successfully.');
    }


    public function destroy(Notification $notification)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Delete notification')) {
            return Inertia::render('Auth/Forbidden');
        }

        $notification->delete();

        return redirect()->route('notifications.index')->with('success', 'Notification deleted successfully.');
    }
}
