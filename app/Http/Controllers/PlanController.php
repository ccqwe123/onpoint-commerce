<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Client;

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

        $clientId = $request->client_id;

        if (empty($clientId) && $request->filled('client_name')) {
            $client = Client::create([
                'name' => $request->client_name,
            ]);
            $clientId = $client->id;
        }

        $order = Order::create([
            'plan_id'   => $request->plan_id,
            'subtotal'  => $request->subtotal,
            'payment'   => $request->payment,
            'client_id' => $clientId,
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

    public function planList() 
    {
        $plans = Plan::with('descriptions')->latest()->paginate(10);

        return Inertia::render('Plan/Index', [
            'plans' => $plans
        ]);
    }

    public function edit($id)
    {
        $plan = Plan::with('descriptions')->findOrFail($id);

        return Inertia::render('Plan/Edit', [
            'plan' => $plan,
        ]);
    }

    public function update(Request $request, $id)
    {
        $plan = Plan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
            'price' => 'nullable|numeric',
            'descriptions' => 'array',
            'descriptions.*.id' => 'nullable|integer|exists:plan_descriptions,id',
        ]);
        
        $plan->update([
            'name' => $validated['name'],
            'is_active' => $validated['is_active'],
            'price' => $validated['price'],
        ]);
        
        $descriptions = collect($request->input('descriptions', []))
            ->filter(fn ($desc) => !empty($desc['name']))
            ->values();

        $incomingIds = $descriptions->pluck('id')->filter();

        $plan->descriptions()
            ->whereNotIn('id', $incomingIds)
            ->delete();

        foreach ($descriptions as $desc) {
            if (!empty($desc['id'])) {
                $plan->descriptions()->where('id', $desc['id'])->update([
                    'name' => $desc['name'],
                ]);
            } else {
                $plan->descriptions()->create([
                    'name' => $desc['name'],
                ]);
            }
        }

        return redirect()->route('plans.index')->with('success', 'Plan updated!');
    }

    public function toggle($id)
    {
        $plan = Plan::findOrFail($id);
        $plan->is_active = !$plan->is_active;
        $plan->save();

        return redirect()->route('plans.index')->with('success', 'Plan status updated!');
    }
}
