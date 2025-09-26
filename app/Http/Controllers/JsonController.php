<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;

class JsonController extends Controller
{
    public function fetchCategories(Request $request)
    {
        $query = Category::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        return $query
            ->orderBy($sortBy, $sortDirection)
            ->paginate(10);
    }
    public function fetchProducts(Request $request, $id)
    {
        $query = Product::with(['images'])->where('category_id', $id);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        return $query
            ->orderBy($sortBy, $sortDirection)
            ->paginate(10);
    }

    public function fetchQuotations(Request $request)
    {
        $query = Order::with(['items', 'plan', 'client']);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhere('payment', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('plan', function ($q3) use ($search) {
                        $q3->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        switch ($sortBy) {
            case 'client_name':
                $query->join('clients', 'orders.client_id', '=', 'clients.id')
                    ->orderBy('clients.name', $sortDirection)
                    ->select('orders.*');
                break;

            case 'plan_name':
                $query->join('plans', 'orders.plan_id', '=', 'plans.id')
                    ->orderBy('plans.name', $sortDirection)
                    ->select('orders.*');
                break;

            case 'total_quantity':
                $query->withSum('items as total_quantity', 'quantity')
                    ->orderBy('total_quantity', $sortDirection);
                break;

            case 'subtotal':
                $query->orderBy('subtotal', $sortDirection);
                break;

            case 'payment':
                $query->orderBy('payment', $sortDirection);
                break;

            default:
                $query->orderBy('id', $sortDirection);
                break;
        }

        return $query->paginate(10)->appends($request->query());
    }

}
