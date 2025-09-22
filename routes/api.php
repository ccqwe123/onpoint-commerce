<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PlanController;

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

Route::get('/categories-products', [ProductController::class, 'index']);
Route::get('/categories/{id}/products', [ProductController::class, 'getByCategory']);
Route::post('/products/by-ids', [ProductController::class, 'getByIds']);
Route::get('/plans', [PlanController::class, 'index']);

Route::get('/plan/{id}', [PlanController::class, 'getPlan']);
Route::post('/orders', [PlanController::class, 'order']);

