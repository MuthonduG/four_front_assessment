<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $wallet = Wallet::create([
            'user_id' => $request->user_id,
            'name' => $request->name,
            'description' => $request->description,
            'balance' => 0 
        ]);

        return response()->json($wallet, 201);
    }

    
    public function show($id)
    {
        $wallet = Wallet::with('transactions')->find($id);
        
        if (!$wallet) {
            return response()->json(['message' => 'Wallet not found'], 404);
        }

        return response()->json([
            'wallet' => [
                'id' => $wallet->id,
                'name' => $wallet->name,
                'description' => $wallet->description,
                'balance' => $wallet->balance,
                'user_id' => $wallet->user_id
            ],
            'transactions' => $wallet->transactions->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'title' => $transaction->title,
                    'description' => $transaction->description,
                    'amount' => $transaction->amount,
                    'type' => $transaction->type,
                    'created_at' => $transaction->created_at
                ];
            })
        ]);
    }
}