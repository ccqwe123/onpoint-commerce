<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\JsonController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/categories', [JsonController::class, 'fetchCategories']);
Route::get('/products/{id}', [JsonController::class, 'fetchProducts']);
Route::get('/quotations', [JsonController::class, 'fetchQuotations']);
Route::get('/users', [JsonController::class, 'fetchUsers']);

Route::get('/categories-products', [ProductController::class, 'index']);
Route::get('/categories/{id}/products', [ProductController::class, 'getByCategory']);
Route::get('/category/{id}/products', [ProductController::class, 'fetchProductsByCategory']);
Route::post('/products/by-ids', [ProductController::class, 'getByIds']);
Route::get('/plans', [PlanController::class, 'index']);

Route::get('/plan/{id}', [PlanController::class, 'getPlan']);
Route::post('/orders', [PlanController::class, 'order']);
Route::get('/clients/search', [ClientController::class, 'search']);

Route::get('/plans',[JsonController::class,'landingpagePlans']);

