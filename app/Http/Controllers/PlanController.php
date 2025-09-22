<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Plan;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::with('descriptions')->where('is_active', true)->get();
        return response()->json($plans);
    }

    public function getPlan($id)
    {
        $plan = Plan::with('descriptions')->where('id', $id)->where('is_active', true)->first();
        return response()->json($plan);
    }

    public function order(Request $request)
    {
        $data = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'cart' => 'required|array',
            'cart.*.product_id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.price' => 'required|numeric',
            'subtotal' => 'required|numeric',
            'payment' => 'required|string',
        ]);

        // Example: save order
        $order = Order::create([
            'plan_id' => $data['plan_id'],
            'subtotal' => $data['subtotal'],
            'payment' => $data['payment'],
        ]);

        foreach ($data['cart'] as $item) {
            $order->items()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        return response()->json(['success' => true, 'order_id' => $order->id]);
    }
}
