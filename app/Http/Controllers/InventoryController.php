<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InventoryController extends Controller
{
    public function index()
    {
        return view('inventory.index');
    }

    public function list(Request $request)
    {
        $purchases = [];
        $sales = [];
        $data = [];
        $where = [];

        switch ($request->select_type) {
            case 'purchase':
                $purchases = DB::table('view_purchase_details')
                    ->orderBy('purchase_date')
                    ->orderBy('product_id')
                    ->get();
                break;
            case 'sale':
                $sales = DB::table('view_sale_details')
                    ->orderBy('date')
                    ->orderBy('product_id')
                    ->get();
                break;
            default:
                $purchases = DB::table('view_purchase_details')
                            ->orderBy('purchase_date')
                            ->orderBy('product_id')
                            ->get();
                $sales = DB::table('view_sale_details')
                            ->orderBy('date')
                            ->orderBy('product_id')
                            ->get();
                break;
        }

        

        Log::emergency('purchases');
        Log::emergency(print_r($purchases, true));
        Log::emergency('sales');
        Log::emergency(print_r($sales, true));
        
    }

    public function loadSearchComboSuppliers()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_suppliers')];
        $suppliers = DB::table('view_inventory_suppliers_list')->get();

        if ($suppliers->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.supplier_select_supplier')];
        }

        $suppliers->prepend((object)$option_initial);
        return $suppliers;
    }

    public function loadSearchComboBrands()
    {

        $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];

        $brands = DB::table('view_inventory_brands_list')->select(['id', 'name'])->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);  

       
        return $brands;
    }

    public function loadSearchComboClients()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_clients')];

        $clients = DB::table('view_inventory_clients_list')->get();

        if ($clients->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_client')];
        }

        $clients->prepend((object)$option_initial);

        return $clients;
    }

    public function searchBrandBySupplierId(Request $request)
    {
        $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];

        $brands = DB::table('view_inventory_brands_list')
                    ->select(['id', 'name'])
                    ->where('supplier_id', $request->supplier_id)
                    ->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);  

        
        return $brands;
    }
}
