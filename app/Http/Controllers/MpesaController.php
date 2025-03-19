<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\MpesaService;

class MpesaController extends Controller
{
    protected $mpesaService;

    public function __construct(MpesaService $mpesaService)
    {
        $this->mpesaService = $mpesaService;
    }

    public function sendB2CPayment(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:10',
            'amount' => 'required|numeric|min:1'
        ]);

        $response = $this->mpesaService->sendB2CPayment($request->phone, $request->amount);

        return response()->json($response);
    }
}
