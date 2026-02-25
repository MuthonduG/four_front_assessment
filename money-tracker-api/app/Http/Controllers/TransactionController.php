<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'wallet_id' => 'required|exists:wallets,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:income,expense'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request) {
            $wallet = Wallet::find($request->wallet_id);

            $transaction = Transaction::create([
                'wallet_id' => $request->wallet_id,
                'title' => $request->title,
                'description' => $request->description,
                'amount' => $request->amount,
                'type' => $request->type
            ]);

            if ($request->type === 'income') {
                $wallet->balance += $request->amount;
            } else { 
                if ($wallet->balance < $request->amount) {
                    return response()->json([
                        'message' => 'Insufficient balance for this expense'
                    ], 400);
                }
                $wallet->balance -= $request->amount;
            }

            $wallet->save();

            return response()->json([
                'transaction' => $transaction,
                'new_balance' => $wallet->balance
            ], 201);
        });
    }
}