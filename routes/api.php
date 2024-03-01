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
    Route::delete('/user/{id}', [App\Http\Controllers\UserController::class, 'destroy'])->name('api.user.delete');
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
    Route::get('/brand/supplier/{id}', [App\Http\Controllers\BrandController::class, 'brandBySupplier'])->name('api.brand.supplier');
    Route::get('/brand/all/supplier/{id}', [App\Http\Controllers\BrandController::class, 'allBrandsBySupplier'])->name('api.brand.all.supplier');
    
    Route::get('/brand/load/create/suppliers', [\App\Http\Controllers\BrandController::class, 'loadCreateComboSuppliers'])->name('api.brand.load.create.combo-supliers');
    Route::get('/brand/load/edit/suppliers', [\App\Http\Controllers\BrandController::class, 'loadEditComboSuppliers'])->name('api.brand.load.edit.combo-supliers');
    Route::get('/brand/load/serach/suppliers', [\App\Http\Controllers\BrandController::class, 'loadSearchComboSuppliers'])->name('api.brand.load.combo.suppliers');
});

Route::group(['middleware' => ['auth.jwt']], function() {
    Route::get('/product/list', [App\Http\Controllers\ProductController::class, 'list'])->name('api.product.list');
    Route::get('/product/saleunit/{id}', [App\Http\Controllers\ProductController::class, 'saleUnit'])->name('api.product.saleUnit');
    Route::get('/product/gencode', [App\Http\Controllers\ProductController::class, 'generateCode'])->name('api.product.gencode');
    Route::post('/product', [App\Http\Controllers\ProductController::class, 'store'])->name('api.product.store');
    Route::get('/product/{id}', [App\Http\Controllers\ProductController::class, 'getProductById'])->name('api.product.show');
    Route::put('/product/{id}', [App\Http\Controllers\ProductController::class, 'update'])->name('api.product.update');
    Route::delete('/product/{id}/delete', [App\Http\Controllers\ProductController::class, 'destroy'])->name('api.product.destroy');
    Route::put('/product/{id}/activate', [App\Http\Controllers\ProductController::class, 'activate'])->name('api.product.activate');
    Route::put('/product/{id}/deactivate', [App\Http\Controllers\ProductController::class, 'deactivate'])->name('api.product.deactivate');
    Route::put('/product/all/activatebyselection', [App\Http\Controllers\ProductController::class, 'activateBySelection'])->name('api.product.all_active');
    Route::put('/product/all/deactivatebyselection', [App\Http\Controllers\ProductController::class, 'deactivateBySelection'])->name('api.product.all_desactive');
    Route::put('/product/all/deletebyselection', [App\Http\Controllers\ProductController::class, 'deleteBySelection'])->name('api.product.all_delete');
    Route::get('/product/code', [App\Http\Controllers\ProductController::class, 'validateCode'])->name('api.product.validate_code');
    Route::get('/product/brand/supplier/{id}', [App\Http\Controllers\ProductController::class, 'getBrandsBySupplierId'])->name('api.product.brand.supplier');
    
    Route::get('/product/load/serach/suppliers', [\App\Http\Controllers\ProductController::class, 'loadSearchComboSuppliers'])->name('api.product.load.combo.suppliers');
    Route::get('/product/load/serach/brands', [\App\Http\Controllers\ProductController::class, 'loadSearchComboBrands'])->name('api.product.load.combo.brands');
    Route::get('/product/brand/supplier/combo/{id}', [App\Http\Controllers\ProductController::class, 'getBrandsBySupplierIdCombo'])->name('api.product.brand.supplier-combo');

});

Route::group(['middleware' => ['auth.jwt']], function() {
    Route::get('/log-module/list', [App\Http\Controllers\LogModuleController::class, 'list'])->name('api.logs.list');
    Route::get('/log-module/{id}/edit', [App\Http\Controllers\LogModuleController::class, 'edit'])->name('api.logs.edit');
});

Route::group(['middleware' => ['auth.jwt']], function() {
    Route::get('/log-record/{id}/list', [App\Http\Controllers\LogRecordController::class, 'list'])->name('api.logs.record.list');
    Route::get('/log-record/{id}/show/{id_log}', [App\Http\Controllers\LogRecordController::class, 'show'])->name('api.logs.record.list');
    http://127.0.0.1:8000/api/log-record/24/show/28
});


Route::group(['middleware' => ['auth.jwt']], function() {
    Route::get('/suppliers', [App\Http\Controllers\SuppliersControlles::class, 'list'])->name('api.suppliers.list');
    Route::post('/suppliers', [App\Http\Controllers\SuppliersControlles::class, 'store'])->name('api.suppliers.store');
    Route::get('/suppliers/{id}', [App\Http\Controllers\SuppliersControlles::class, 'edit'])->name('api.suppliers.edit');
    Route::put('/suppliers/{id}', [App\Http\Controllers\SuppliersControlles::class, 'update'])->name('api.suppliers.update');
    Route::get('/suppliers/all/combobox', [App\Http\Controllers\SuppliersControlles::class, 'combobox'])->name('api.supliers.combobox');
    Route::get('/suppliers/filter/combobox', [App\Http\Controllers\SuppliersControlles::class, 'combobox_filters'])->name('suppliers.filtres.combo');
    Route::delete('/suppliers/{id}', [App\Http\Controllers\SuppliersControlles::class, 'destroy'])->name('api.suppliers.destroy');
    Route::put('/suppliers/{id}/activate', [App\Http\Controllers\SuppliersControlles::class, 'activate'])->name('api.suppliers.activate');
    Route::put('/suppliers/{id}/deactivate', [App\Http\Controllers\SuppliersControlles::class, 'deactivate'])->name('api.suppliers.deactivate');
    Route::put('/suppliers/all/activatebyselection', [App\Http\Controllers\SuppliersControlles::class, 'activateBySelection'])->name('api.suppliers.all_active');
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

Route::group(['middleware' => ['auth.jwt']], function(){
    Route::post('/purchase',[App\Http\Controllers\PurchaseController::class, 'store'])->name('api.purchase.store');
    Route::get('/purchase/list', [App\Http\Controllers\PurchaseController::class, 'list'])->name('api.purchase.list');
    Route::get('/purchase/load/create/suppliers', [\App\Http\Controllers\PurchaseController::class, 'loadCreateComboSuppliers'])->name('api.supplier.load.create.combo-supliers');
    Route::get('/purchase/getBrandsBySupplierId/{id}', [\App\Http\Controllers\PurchaseController::class, 'getBrandsBySupplierId'])->name('api.purchase.brand-combo');
    Route::get('/purchase/getProductsByBrandId/{id}', [\App\Http\Controllers\PurchaseController::class, 'getProductsByBrandId'])->name('api.purchase.brand-combo');
    
    Route::get('/purchase/load/serach/suppliers', [\App\Http\Controllers\PurchaseController::class, 'loadSearchComboSuppliers'])->name('api.purchase.load.combo.suppliers');
    Route::get('/purchase/load/serach/brands', [\App\Http\Controllers\PurchaseController::class, 'loadSearchComboBrands'])->name('api.purchase.load.combo.brands');
    Route::get('/purchase/load/search/products', [\App\Http\Controllers\PurchaseController::class, 'loadSearchComboProducts'])->name('api.purchase.load.combo.products');

    Route::get('/purchase/getProductSearch/{product_id}', [App\Http\Controllers\PurchaseController::class, 'getproductSearchById'])->name('api.purchase.getProductSearch');
    Route::get('/purchase/productSearch', [App\Http\Controllers\PurchaseController::class, 'searchProductByBrandIdAndSupplierId'])->name('api.purchase.search-product');
    Route::get('/purchase/getbrandSearchById', [App\Http\Controllers\PurchaseController::class, 'searchBrandBySupplierId'])->name('api.purchase.search-brand');
    Route::get('/purchase/modalProductSearch', [App\Http\Controllers\PurchaseController::class, 'searchProduct'])->name('api.sales.modal.search-product');
    Route::get('/purchase/getStockAlert', [App\Http\Controllers\PurchaseController::class, 'getStockAlert'])->name('api.purchase.stockAlert');
});
Route::group(['middleware' => ['auth.jwt']], function(){
    Route::post('/purchase-details',[App\Http\Controllers\PurchaseDetailController::class, 'store'])->name('api.purchase-detail.store');
    Route::get('/purchase-details/{id}', [App\Http\Controllers\PurchaseDetailController::class, 'showList'])->name('api.purchase-detail.show-list');
    
    // Route::get('/purchase-details/list', [App\Http\Controllers\PurchaseDetailController::class, 'list'])->name('api.purchase-detail.list');
    // Route::get('/purchase-details/load/create/suppliers', [\App\Http\Controllers\PurchaseDetailController::class, 'loadCreateComboSuppliers'])->name('api.supplier.load.create.combo-supliers');
    // Route::get('/purchase-details/getBrandsBySupplierId/{id}', [\App\Http\Controllers\PurchaseDetailController::class, 'getBrandsBySupplierId'])->name('api.purchase-detail.brand-combo');
    // Route::get('/purchase-details/getProductsByBrandId/{id}', [\App\Http\Controllers\PurchaseDetailController::class, 'getProductsByBrandId'])->name('api.purchase-detail.brand-combo');
    
    // Route::get('/purchase-details/load/serach/suppliers', [\App\Http\Controllers\PurchaseDetailController::class, 'loadSearchComboSuppliers'])->name('api.purchase-detail.load.combo.suppliers');
    // Route::get('/purchase-details/load/serach/brands', [\App\Http\Controllers\PurchaseDetailController::class, 'loadSearchComboBrands'])->name('api.purchase-detail.load.combo.brands');
    // Route::get('/purchase-details/load/search/products', [\App\Http\Controllers\PurchaseDetailController::class, 'loadSearchComboProducts'])->name('api.purchase-detail.load.combo.products');

    // Route::get('/purchase-details/getProductSearch/{product_id}', [App\Http\Controllers\PurchaseDetailController::class, 'getproductSearchById'])->name('api.purchase-detail.getProductSearch');
    // Route::get('/purchase-details/productSearch', [App\Http\Controllers\PurchaseDetailController::class, 'searchProductByBrandIdAndSupplierId'])->name('api.purchase-detail.search-product');
    // Route::get('/purchase-details/getbrandSearchById', [App\Http\Controllers\PurchaseDetailController::class, 'searchBrandBySupplierId'])->name('api.purchase-detail.search-brand');
    // Route::get('/purchase-details/modalProductSearch', [App\Http\Controllers\PurchaseDetailController::class, 'searchProduct'])->name('api.sales.modal.search-product');
    // Route::get('/purchase-details/getStockAlert', [App\Http\Controllers\PurchaseDetailController::class, 'getStockAlert'])->name('api.purchase-detail.stockAlert');
});

Route::group(['middleware' => ['auth.jwt']], function() {
    Route::post('/sales', [\App\Http\Controllers\SaleController::class, 'store'])->name('api.sales.store');
    Route::get('/sales/list', [\App\Http\Controllers\SaleController::class, 'list'])->name('api.sales.list');
    Route::get('/sales/load/create/suppliers', [\App\Http\Controllers\SaleController::class, 'loadCreateComboSuppliers'])->name('api.sales.load.create.combo-supliers');
    Route::get('/sales/load/create/brands', [\App\Http\Controllers\SaleController::class, 'loadCreateComboBrands'])->name('api.sales.load.create.combo-brands');
    Route::get('/sales/load/create/clients', [\App\Http\Controllers\SaleController::class, 'loadCreateComboClients'])->name('api.sales.load.create.combo-clients');
    /**
     * Rutas para cargar los cambos de la vista index
     */
    Route::get('/sales/load/serach/suppliers', [\App\Http\Controllers\SaleController::class, 'loadSearchComboSuppliers'])->name('api.sales.load.combo.suppliers');
    Route::get('/sales/load/serach/brands', [\App\Http\Controllers\SaleController::class, 'loadSearchComboBrands'])->name('api.sales.load.combo.brands');
    Route::get('/sales/load/search/products', [\App\Http\Controllers\SaleController::class, 'loadSearchComboProducts'])->name('api.sales.load.combo.products');
    Route::get('/sales/load/search/clients', [\App\Http\Controllers\SaleController::class, 'loadSearchComboClients'])->name('api.sales.load.combo.clients');
    /**
     * End combos de la vista index
     */
    Route::get('/sales/getBrandsBySupplierId/{id}', [\App\Http\Controllers\SaleController::class, 'getBrandsBySupplierId'])->name('api.sales.brand-combo');
    Route::get('/sales/getProductsByBrandId/{id}', [\App\Http\Controllers\SaleController::class, 'getProductsByBrandId'])->name('api.sales.brand-combo');
    Route::get('/sales/brandSearch', [App\Http\Controllers\SaleController::class, 'searchBrandBySupplierId'])->name('api.sales.search-brand');
    Route::get('/sales/productSearch', [App\Http\Controllers\SaleController::class, 'searchProductByBrandId'])->name('api.sales.search-product');
    Route::get('/sales/modalProductSearch', [App\Http\Controllers\SaleController::class, 'searchProduct'])->name('api.sales.modal.search-product');
});
Route::group(['middleware' => ['auth.jwt']], function() {
    Route::post('/sale-details', [\App\Http\Controllers\SaleDetailController::class, 'store'])->name('api.sale-details.store');
    Route::get('/sale-details/{id}', [\App\Http\Controllers\SaleDetailController::class, 'showList'])->name('api.sale-details.show-list');
    
    // Route::get('/sale-details/list', [\App\Http\Controllers\SaleDetailController::class, 'list'])->name('api.sale-details.list');
    // Route::get('/sale-details/load/create/suppliers', [\App\Http\Controllers\SaleDetailController::class, 'loadCreateComboSuppliers'])->name('api.sale-details.load.create.combo-supliers');
    // Route::get('/sale-details/load/create/brands', [\App\Http\Controllers\SaleDetailController::class, 'loadCreateComboBrands'])->name('api.sale-details.load.create.combo-brands');
    // Route::get('/sale-details/load/create/clients', [\App\Http\Controllers\SaleDetailController::class, 'loadCreateComboClients'])->name('api.sale-details.load.create.combo-clients');
    // /**
    //  * Rutas para cargar los cambos de la vista index
    //  */
    // Route::get('/sale-details/load/serach/suppliers', [\App\Http\Controllers\SaleDetailController::class, 'loadSearchComboSuppliers'])->name('api.sale-details.load.combo.suppliers');
    // Route::get('/sale-details/load/serach/brands', [\App\Http\Controllers\SaleDetailController::class, 'loadSearchComboBrands'])->name('api.sale-details.load.combo.brands');
    // Route::get('/sale-details/load/search/products', [\App\Http\Controllers\SaleDetailController::class, 'loadSearchComboProducts'])->name('api.sale-details.load.combo.products');
    // Route::get('/sale-details/load/search/clients', [\App\Http\Controllers\SaleDetailController::class, 'loadSearchComboClients'])->name('api.sale-details.load.combo.clients');
    // /**
    //  * End combos de la vista index
    //  */
    // Route::get('/sale-details/getBrandsBySupplierId/{id}', [\App\Http\Controllers\SaleDetailController::class, 'getBrandsBySupplierId'])->name('api.sale-details.brand-combo');
    // Route::get('/sale-details/getProductsByBrandId/{id}', [\App\Http\Controllers\SaleDetailController::class, 'getProductsByBrandId'])->name('api.sale-details.brand-combo');
    // Route::get('/sale-details/brandSearch', [App\Http\Controllers\SaleDetailController::class, 'searchBrandBySupplierId'])->name('api.sale-details.search-brand');
    // Route::get('/sale-details/productSearch', [App\Http\Controllers\SaleDetailController::class, 'searchProductByBrandId'])->name('api.sale-details.search-product');
    // Route::get('/sale-details/modalProductSearch', [App\Http\Controllers\SaleDetailController::class, 'searchProduct'])->name('api.sale-details.modal.search-product');
});
