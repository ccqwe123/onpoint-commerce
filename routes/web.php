<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
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
});

require __DIR__.'/auth.php';
