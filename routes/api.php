<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login','App\Http\Controllers\Auth\LoginController@ajaxLogin')->name('api.login');

Route::group(['middleware' => ['auth.jwt']],function(){
    Route::get('/user/genpass', [App\Http\Controllers\UserController::class, 'generatePassword'])->name('api.user.generatePassword');
    Route::get('/user/list', [App\Http\Controllers\UserController::class, 'list'])->name('api.user.list');
    Route::post('/user', [App\Http\Controllers\UserController::class, 'store'])->name('api.user.store');
    Route::get('/user/{id}', [App\Http\Controllers\UserController::class, 'show'])->name('api.user.show');
    Route::put('/user/{id}', [App\Http\Controllers\UserController::class, 'update'])->name('api.user.update');
    Route::delete('/user/{id}', [App\Http\Controllers\UserController::class, 'delete'])->name('api.user.delete');
    Route::put('/user/{id}/activar', [App\Http\Controllers\UserController::class, 'activar'])->name('api.brand.activar');
    Route::put('/user/{id}/desactivar', [App\Http\Controllers\UserController::class, 'desactivar'])->name('api.brand.deactivar');
    Route::put('/user/all/activarbyselection', [App\Http\Controllers\UserController::class, 'activarBySelection'])->name('api.user.all_active');
    Route::put('/user/all/desactivarbyselection', [App\Http\Controllers\UserController::class, 'desactivarBySelection'])->name('api.user.all_desactive');
    Route::put('/user/all/deletebyselection', [App\Http\Controllers\UserController::class, 'deleteBySelection'])->name('api.user.all_delete');


});

Route::group(['middleware' => ['auth.jwt']], function() {
    Route::get('/brand', [App\Http\Controllers\BrandController::class, 'list'])->name('api.brand.list');
    Route::post('/brand', [App\Http\Controllers\BrandController::class, 'store'])->name('api.brand.store');
    Route::get('/brand/{id}/edit', [App\Http\Controllers\BrandController::class, 'edit'])->name('api.brand.edit');
    Route::put('/brand/{id}/update', [App\Http\Controllers\BrandController::class, 'update'])->name('api.brand.update');
    Route::put('/brand/{id}/activar', [App\Http\Controllers\BrandController::class, 'activar'])->name('api.brand.activar');
    Route::put('/brand/{id}/desactivar', [App\Http\Controllers\BrandController::class, 'desactivar'])->name('api.brand.deactivar');
    Route::delete('/brand/{id}/delete', [App\Http\Controllers\BrandController::class, 'destroy'])->name('api.brand.delete');
    Route::put('/brand/all/activarbyselection', [App\Http\Controllers\BrandController::class, 'activarBySelection'])->name('api.brand.all_active');
    Route::put('/brand/all/desactivarbyselection', [App\Http\Controllers\BrandController::class, 'desactivarBySelection'])->name('api.brand.all_desactive');
    Route::put('/brand/all/deletebyselection', [App\Http\Controllers\BrandController::class, 'deleteBySelection'])->name('api.brand.all_delete');
});


Route::get('/product/list', [App\Http\Controllers\ProductController::class, 'list'])->name('api.product.list');
Route::get('/product/saleunit/{id}', [App\Http\Controllers\ProductController::class, 'saleUnit'])->name('api.product.saleUnit');
Route::get('/product/gencode', [App\Http\Controllers\ProductController::class, 'generateCode'])->name('api.product.gencode');
Route::post('/product', [App\Http\Controllers\ProductController::class, 'store'])->name('api.product.store');
Route::put('/product/{id}', [App\Http\Controllers\ProductController::class, 'update'])->name('api.product.update');
Route::delete('/product/{id}/delete', [App\Http\Controllers\ProductController::class, 'destroy'])->name('api.product.destroy');
Route::put('/product/all/activarbyselection', [App\Http\Controllers\ProductController::class, 'activarBySelection'])->name('api.product.all_active');
Route::put('/product/all/desactivarbyselection', [App\Http\Controllers\ProductController::class, 'desactivarBySelection'])->name('api.product.all_desactive');
Route::put('/product/all/deletebyselection', [App\Http\Controllers\ProductController::class, 'deleteBySelection'])->name('api.product.all_delete');




