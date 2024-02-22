<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SaleController extends Controller
{
    public function index()
    {  
        return view('sale.index');
    }

    public function list()
    {
        return [];
    }
    
    public function create()
    {
        $lims_clients_list = DB::table('view_clients_active')->get();
        $lims_suppliers_list = DB::table('view_suppliers_sales_create')->get();
        return view('sale.create', compact('lims_clients_list', 'lims_suppliers_list'));
    }

    public function store(Request $request)
    {

        Log::emergency('client_id');
        Log::emergency(print_r($request->client_id, true));
        Log::emergency('date');
        Log::emergency(print_r($request->date, true));
        Log::emergency('total');
        Log::emergency(print_r($request->total, true));
        Log::emergency('product_details');
        Log::emergency(print_r($request->product_details, true));

        

        $save = DB::select(
                    "CALL save_sale(?,?,?,?,?)", 
                    [
                        $request->client_id, 
                        $request->date,
                        $request->total,
                        $request->comments, 
                        json_encode($request->product_details)
                    ]
                );
        $save = current($save);

        if (isset($save->message)) {
            return response()->json(['status' => 'succes', 'message' => $save->message]); 
        }

    }

    public function getBrandsBySupplierId($id)
    {
        $brands = DB::table('view_brands_sales_create')->select(['id', 'name'])->where('supplier_id', $id)->get();

        return $brands;
    }

    public function getProductsByBrandId($id)
    {
        $brands = DB::table('view_products_list')->select(['id', 'name'])->where('brand_id', $id)->get();

        return $brands;
    }
}
