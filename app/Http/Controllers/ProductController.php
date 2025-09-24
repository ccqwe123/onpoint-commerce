<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Order;
use Illuminate\Support\Facades\Storage;
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

    public function productStore(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|boolean',
            'description' => 'required|nullable|string',
            'price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'images.*' => 'nullable|image|max:10240',
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'status' => $validated['status'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'category_id' => $validated['category_id'],
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('images/products'), $filename);

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => '/images/products/' . $filename,
                    'is_primary' => 0,
                ]);
            }

            $firstImage = $product->images()->first();
            if ($firstImage) {
                $firstImage->is_primary = 1;
                $firstImage->save();
            }
        }

        return redirect()->back()->with('success', 'Product created successfully.');
    }

    public function productEdit($category_id, $product_id)
    {
        $category = Category::findOrFail($category_id);
        $product = Product::with('images')->where('id', $product_id)->firstOrFail();

        return Inertia::render('ProductCategory/ProductEdit', [
            'category' => $category,
            'product' => $product,
        ]);
    }

    public function productUpdate(Request $request, $id)
    {
        $cleanDescription = trim(strip_tags($request->input('description', '')));

        if ($cleanDescription === '' || $cleanDescription === '&nbsp;') {
            $request->merge(['description' => null]); 
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|boolean',
            'description' => 'required',
            'price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'stock' => 'required|numeric',
            // 'images.*' => 'nullable|image|max:10240',
            // 'existing_images.*' => 'nullable|integer|exists:product_images,id',
        ]);

        $product = Product::findOrFail($id);

         $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'stock' => $request->stock,
            'is_active' => $request->status,
        ]);
        $images = $request->input('images', []);
        $existingImages = array_filter($images, fn($img) => is_numeric($img));
        $newFiles = $request->file('images') ?? [];

        $product->images()->whereNotIn('id', $existingImages)->delete();

        foreach ($newFiles as $file) {
            $filename = uniqid('product_', true) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/products'), $filename);

            $product->images()->create([
                'image_path' => '/images/products/' . $filename,
                'is_primary' => 0,
            ]);
        }

        foreach (array_values($existingImages) as $index => $imageId) {
            $image = ProductImage::find($imageId);
            if ($image) {
                $image->is_primary = $index === 0 ? 1 : 0;
                $image->save();
            }
        }

        return redirect()->route('product-categories.index')->with('success', 'Category status updated successfully.');
    }

    public function quotation()
    {
        $orders = Order::with(['items','plan','client'])->latest()->paginate(10);

        return Inertia::render('Quotation/Index', [
            'orders' => $orders,
        ]);
    }

    public function quotationView($id)
    {
        $order = Order::with(['items.product.category', 'plan.descriptions'])->where('id', $id)->firstOrFail();
        return Inertia::render('Quotation/View', [
            'order' => $order,
        ]);
    }
}
