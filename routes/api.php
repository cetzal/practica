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
    Route::put('/user/{id}/activate', [App\Http\Controllers\UserController::class, 'activate'])->name('api.brand.activate');
    Route::put('/user/{id}/deactivate', [App\Http\Controllers\UserController::class, 'deactivate'])->name('api.brand.deactivate');
    Route::put('/user/all/activatebyselection', [App\Http\Controllers\UserController::class, 'activateBySelection'])->name('api.user.all_active');
    Route::put('/user/all/deactivatebyselection', [App\Http\Controllers\UserController::class, 'deactivateBySelection'])->name('api.user.all_desactive');
    Route::put('/user/all/deletebyselection', [App\Http\Controllers\UserController::class, 'deleteBySelection'])->name('api.user.all_delete');


});

Route::group(['middleware' => ['auth.jwt']], function() {
    Route::get('/brand', [App\Http\Controllers\BrandController::class, 'list'])->name('api.brand.list');
    Route::post('/brand', [App\Http\Controllers\BrandController::class, 'store'])->name('api.brand.store');
    Route::get('/brand/{id}/edit', [App\Http\Controllers\BrandController::class, 'edit'])->name('api.brand.edit');
    Route::put('/brand/{id}/update', [App\Http\Controllers\BrandController::class, 'update'])->name('api.brand.update');
    Route::put('/brand/{id}/activate', [App\Http\Controllers\BrandController::class, 'activate'])->name('api.brand.activar');
    Route::put('/brand/{id}/deactivate', [App\Http\Controllers\BrandController::class, 'deactivate'])->name('api.brand.deactivate');
    Route::delete('/brand/{id}/delete', [App\Http\Controllers\BrandController::class, 'destroy'])->name('api.brand.delete');
    Route::put('/brand/all/activatebyselection', [App\Http\Controllers\BrandController::class, 'activateBySelection'])->name('api.brand.all_active');
    Route::put('/brand/all/deactivatebyselection', [App\Http\Controllers\BrandController::class, 'deactivateBySelection'])->name('api.brand.all_desactive');
    Route::put('/brand/all/deletebyselection', [App\Http\Controllers\BrandController::class, 'deleteBySelection'])->name('api.brand.all_delete');
});

Route::group(['middleware' => ['auth.jwt']], function() {
    Route::get('/product/list', [App\Http\Controllers\ProductController::class, 'list'])->name('api.product.list');
    Route::get('/product/saleunit/{id}', [App\Http\Controllers\ProductController::class, 'saleUnit'])->name('api.product.saleUnit');
    Route::get('/product/gencode', [App\Http\Controllers\ProductController::class, 'generateCode'])->name('api.product.gencode');
    Route::post('/product', [App\Http\Controllers\ProductController::class, 'store'])->name('api.product.store');
    Route::put('/product/{id}', [App\Http\Controllers\ProductController::class, 'update'])->name('api.product.update');
    Route::delete('/product/{id}/delete', [App\Http\Controllers\ProductController::class, 'destroy'])->name('api.product.destroy');
    Route::put('/product/{id}/activate', [App\Http\Controllers\ProductController::class, 'activate'])->name('api.product.activate');
    Route::put('/product/{id}/deactivate', [App\Http\Controllers\ProductController::class, 'deactivate'])->name('api.product.deactivate');
    Route::put('/product/all/activarbyselection', [App\Http\Controllers\ProductController::class, 'activarBySelection'])->name('api.product.all_active');
    Route::put('/product/all/deactivatebyselection', [App\Http\Controllers\ProductController::class, 'deactivateBySelection'])->name('api.product.all_desactive');
    Route::put('/product/all/deletebyselection', [App\Http\Controllers\ProductController::class, 'deleteBySelection'])->name('api.product.all_delete');
    Route::get('/product/code', [App\Http\Controllers\ProductController::class, 'validateCode'])->name('api.product.validate_code');

});

Route::group(['middleware' => ['auth.jwt']], function() {
    Route::get('/log-module/list', [App\Http\Controllers\LogModuleController::class, 'list'])->name('api.logs.list');
    Route::get('/log-module/{id}/edit', [App\Http\Controllers\LogModuleController::class, 'edit'])->name('api.logs.edit');
});


Route::group(['middleware' => ['auth.jwt']], function() {
    Route::get('/suppliers', [App\Http\Controllers\SuppliersControlles::class, 'list'])->name('api.suppliers.list');
    Route::post('/suppliers', [App\Http\Controllers\SuppliersControlles::class, 'store'])->name('api.suppliers.store');
    Route::get('/suppliers/{id}', [App\Http\Controllers\SuppliersControlles::class, 'show'])->name('api.suppliers.show');
    Route::put('/suppliers/{id}', [App\Http\Controllers\SuppliersControlles::class, 'update'])->name('api.suppliers.update');
    Route::delete('/suppliers/{id}', [App\Http\Controllers\SuppliersControlles::class, 'destroy'])->name('api.suppliers.destroy');
    Route::put('/suppliers/{id}/activate', [App\Http\Controllers\SuppliersControlles::class, 'activate'])->name('api.suppliers.activate');
    Route::put('/suppliers/{id}/deactivate', [App\Http\Controllers\SuppliersControlles::class, 'deactivate'])->name('api.suppliers.deactivate');
    Route::put('/suppliers/all/activarbyselection', [App\Http\Controllers\SuppliersControlles::class, 'activateBySelection'])->name('api.suppliers.all_active');
    Route::put('/suppliers/all/deactivatebyselection', [App\Http\Controllers\SuppliersControlles::class, 'deactivateBySelection'])->name('api.suppliers.all_desactive');
    Route::put('/suppliers/all/deletebyselection', [App\Http\Controllers\SuppliersControlles::class, 'deleteBySelection'])->name('api.suppliers.all_delete');
});


Route::group(['middleware' => ['auth.jwt']], function() {
    Route::get('/clients', [App\Http\Controllers\ClientsControlles::class, 'list'])->name('api.clients.list');
    Route::post('/clients', [App\Http\Controllers\ClientsControlles::class, 'store'])->name('api.clients.store');
    Route::get('/clients/{id}', [App\Http\Controllers\ClientsControlles::class, 'show'])->name('api.clients.show');
    Route::put('/clients/{id}', [App\Http\Controllers\ClientsControlles::class, 'update'])->name('api.clients.update');
    Route::delete('/clients/{id}', [App\Http\Controllers\ClientsControlles::class, 'destroy'])->name('api.clients.destroy');
    Route::put('/clients/{id}/activate', [App\Http\Controllers\ClientsControlles::class, 'activate'])->name('api.clients.activate');
    Route::put('/clients/{id}/deactivate', [App\Http\Controllers\ClientsControlles::class, 'deactivate'])->name('api.clients.deactivate');
    Route::put('/clients/all/activarbyselection', [App\Http\Controllers\ClientsControlles::class, 'activateBySelection'])->name('api.clients.all_active');
    Route::put('/clients/all/deactivatebyselection', [App\Http\Controllers\ClientsControlles::class, 'deactivateBySelection'])->name('api.clients.all_desactive');
    Route::put('/clients/all/deletebyselection', [App\Http\Controllers\ClientsControlles::class, 'deleteBySelection'])->name('api.clients.all_delete');
});
