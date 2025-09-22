<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
class ProductController extends Controller
{
    public function index()
    {
        $categories = Category::with(['products.images'])
            ->where('is_active', true)
            ->get();

        return response()->json($categories);
    }

    public function getByCategory($categoryId)
    {
        $products = Category::with(['products.images'])
            ->where('id', $categoryId)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($products);
    }

    public function getByIds(Request $request)
    {
        $ids = $request->input('ids', []);
        $products = Product::with(['images', 'category'])->whereIn('id', $ids)->get();

        return response()->json($products);
    }
}
