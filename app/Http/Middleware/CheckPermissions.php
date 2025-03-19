<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckPermissions
{
    public function handle(Request $request, Closure $next, $permission): Response
    {
        $user = Auth::user();

        // Ensure the user is authenticated and has the required permission
        if (!$user || !$user->can($permission)) {
            return redirect()->route('forbidden'); // Redirect to Forbidden page
        }

        return $next($request);
    }
}
