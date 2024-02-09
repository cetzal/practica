<?php

use Illuminate\Support\Facades\Route;

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

// Route::get('/', function () {
//     return view('welcome');
// })->name('home');

// error en webpack --hide-modules

// Auth::routes();
Route::get('login','App\Http\Controllers\Auth\LoginController@showLoginForm')->name('login');
Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::group(['middleware'=> ['auth.jwt']], function () {
    Route::get('logout','App\Http\Controllers\Auth\LoginController@logout')->name('logout');
    Route::get('/user', [App\Http\Controllers\UserController::class, 'index'])->name('user.index');
    Route::get('/user/create', [App\Http\Controllers\UserController::class, 'create'])->name('user.create');
    Route::get('/brand', [App\Http\Controllers\BrandController::class, 'index'])->name('brand.index');
    Route::get('/product', [App\Http\Controllers\ProductController::class, 'index'])->name('products.index');
    Route::get('/product/create', [App\Http\Controllers\ProductController::class, 'create'])->name('products.create');
    Route::get('/product/{id}/edit', [App\Http\Controllers\ProductController::class, 'edit'])->name('products.edit');
});

