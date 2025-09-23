<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

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

    public function categoryList() 
    {
        $categories = Category::with('products')->paginate(10);

        return Inertia::render('ProductCategory/Index', [
            'categories' => $categories
        ]);
    }

    public function categoryCreate() 
    {
        return Inertia::render('ProductCategory/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        Category::create($data);

        return redirect()->route('product-categories.index')->with('success', 'Category created successfully.');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        $category = Category::findOrFail($id);
        $category->update($data);

        return redirect()->route('product-categories.index')->with('success', 'Category updated successfully.');
    }

    public function toggle($id)
    {
        $category = Category::findOrFail($id);
        $category->is_active = !$category->is_active;
        $category->save();

        return redirect()->route('product-categories.index')->with('success', 'Category status updated successfully.');
    }

    public function productList($id)
    {
        $products = Product::with(['images'])->where('category_id',$id)->paginate(10);
        $category = Category::findOrFail($id);

        return Inertia::render('ProductCategory/ProductList', [
            'category' => $category,
            'products' => $products
        ]);
    }

    public function productCreate($id)
    {
        $category = Category::findOrFail($id);
        return Inertia::render('ProductCategory/ProductCreate', [
            'category' => $category
        ]);
    }
}
