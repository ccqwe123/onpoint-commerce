<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        $categories = [
            'Electronics',
            'Clothing',
            'Shoes',
            'Books',
            'Furniture',
        ];
        foreach ($categories as $catName) {
            Category::create([
                'name' => $catName,
                'is_active' => true,
            ]);
        }

        for ($i = 1; $i <= 10; $i++) {
            $category = Category::inRandomOrder()->first();

            $product = Product::create([
                'category_id'    => $category->id,
                'name'           => "Product $i",
                'description'    => "This is the description for Product $i.",
                'price'          => rand(100, 1000),
                'discount_price' => rand(50, 500),
                'stock'          => rand(0, 50),
                'is_active'      => true,
            ]);

            // Attach some images
            $product->images()->createMany([
                [
                    'image_path' => "/images/products/product{$i}_1.jpg",
                    'is_primary' => true,
                ],
                [
                    'image_path' => "/images/products/product{$i}_2.jpg",
                    'is_primary' => false,
                ],
            ]);
        }
        DB::table('users')->insert([
            'name' => 'admin',
            'email' => 'onpoint@admin.com',
            'password' => Hash::make('admin'),
        ]);
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call([
            PlanSeeder::class,
        ]);
    }
}
