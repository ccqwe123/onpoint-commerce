<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProductController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware('guest')->group(function () {
    // Route::get('login', function () {
    //     return Inertia::render('Auth/Login');
    // })->name('login');
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});
Route::get('/logout', [AuthenticatedSessionController::class, 'destroy']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/', function () {
        return Inertia::render('Home');
    })->name('home');
    Route::get('/plan', function () {
        return Inertia::render('Plan');
    });
    Route::get('/devices', function () {
        return Inertia::render('Devices');
    });
    Route::get('/shopping-cart', function () {
        return Inertia::render('ShoppingCart');
    });
    Route::get('/payment-terms', function () {
        return Inertia::render('PaymentTerms');
    });
    Route::get('/review-order', function () {
        return Inertia::render('ReviewOrder');
    });
    Route::get('/thank-you', function () {
        return Inertia::render('ThankYou');
    });
    Route::get('/plans',[ PlanController::class, 'planList'])->name('plans.index');
    Route::get('/plan/{id}',[ PlanController::class, 'edit']);
    Route::put('/plan/{id}', [PlanController::class, 'update'])->name('plan.update');
    Route::put('/plan/{id}/toggle', [PlanController::class, 'toggle'])->name('plan.toggle');

    
    Route::get('/product-categories', [ProductController::class, 'categoryList'])->name('product-categories.index');
    Route::get('/product-categories/create', [ProductController::class, 'categoryCreate'])->name('product-categories.create');
    Route::post('/product-categories', [ProductController::class, 'store'])->name('product-categories.store');
    Route::put('/product-categories/{id}', [ProductController::class, 'update'])->name('product-categories.update');
    Route::put('/product-categories/{id}/toggle', [ProductController::class, 'toggle'])->name('product-categories.toggle');

    Route::get('/category/{id}/product-list', [ProductController::class, 'productList'])->name('product-categories.product.index');
    Route::get('/product/{id}/create', [ProductController::class, 'productCreate'])->name('product.create');
    Route::get('/category/{category_id}/product/{product_id}', [ProductController::class, 'productEdit'])->name('category.product.edit');
    Route::post('/product/{id}/store', [ProductController::class, 'productStore'])->name('product.store');
    Route::post('/product/{id}/update', [ProductController::class, 'productUpdate'])->name('product.update');

    Route::get('/quotation', [ProductController::class, 'quotation'])->name('quotation.index');
    Route::get('/quotation/{id}/view', [ProductController::class, 'quotationView'])->name('quotation.view');
});

require __DIR__.'/auth.php';
