<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SaleController extends Controller
{
    public function index()
    {  
        $lims_sales_suppliers_list = DB::table('view_sales_suppliers_list')->get();
        $lims_sales_brands_list = DB::table('view_sales_brands_list')->select(['id', 'name'])->get();
        $lims_sales_products_list = DB::table('view_sales_products_list')->select(['id', 'name'])->get();
        $lims_sales_clients_list = DB::table('view_sales_clients_list')->get();
        return view(
            'sale.index', 
            compact(
                'lims_sales_suppliers_list',
                'lims_sales_brands_list',
                'lims_sales_products_list',
                'lims_sales_clients_list'
            )
        );
    }

    public function list(Request $request)
    {
        $where = [];
        
        if (!empty($request->supplier_id)) {
            $where[] = ['supplier_id', '=', $request->supplier_id];
        }

        if (!empty($request->brand_id)) {
            $where[] = ['brand_id', '=', $request->brand_id];
        }

        if (!empty($request->product_id)) {
            $where[] = ['product_id', '=', $request->product_id];
        }

        if (!empty($request->client_id)) {
            $where[] = ['client_id', '=', $request->client_id];
        }

        if (!empty($request->range_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where[] = [DB::raw('DATE_FORMAT(date,"%Y-%m-%d")'), '>=', trim($date_from)];
            $where[] = [DB::raw('DATE_FORMAT(date,"%Y-%m-%d")'), '<=', trim($date_to)];
        }
        
        $data = DB::table('view_sale_details')
                ->select([
                    'date',
                    'client_id',
                    'client_name',
                    DB::raw('SUM(quantity) as total_quantity'),
                    DB::raw('SUM(total) as total')
                ])
                ->where($where)
                ->groupBy(['date','client_id'])
                ->get();

        $json_data = array(
            "draw"            => intval($request->input('draw')),  
            "recordsTotal"    => intval($data->count()),  
            "recordsFiltered" => intval($data->count()), 
            "data"            => $data
        );

        return response()->json($json_data);
    }
    
    public function create()
    {
        $lims_clients_list = DB::table('view_clients_active')->get();
        $lims_suppliers_list = DB::table('view_suppliers_sales_create')->get();
        return view('sale.create', compact('lims_clients_list', 'lims_suppliers_list'));
    }

    public function store(Request $request)
    {
        $this->validate($request,[
            'client_id' => ['required'],
            'date' => ['required'],
            'total' => ['required'],
            'product_details' => ['required', 'array', 'min:1'],
            'product_details.*.product_id' => ['required'],
            'product_details.*.quantity' => ['required'],
            'product_details.*.unit_price' => ['required'],
            'product_details.*.total' => ['required']
        ]);        

        $save = DB::select(
                    "CALL create_sale(?,?,?,?,?)", 
                    [
                        $request->client_id, 
                        $request->date,
                        $request->total,
                        $request->comments, 
                        json_encode($request->product_details)
                    ]
                );
        Log::emergency('sale');
        Log::emergency(print_r($save, true));
        $save = current($save);

        if (isset($save->message)) {
            return response()->json(['status' => 'succes', 'message' => $save->message]); 
        }

        if(isset($save->error)) {
            return response()->json([
                'errors' => [
                    'message' => [
                        'The sale could not be completed please try again, if the error persists, please contact technical support.'
                    ]
                ]
            ], 422);
            exit;
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

    public function searchBrandBySupplierId(Request $request)
    {
        $brands = DB::table('view_sales_brands_list')
                    ->select(['id', 'name'])
                    ->where('supplier_id', $request->supplier_id)
                    ->get();
        return $brands;
    }

    public function searchProductByBrandId(Request $request)
    {
        $brands = DB::table('view_sales_products_list')
                    ->select(['id', 'name'])
                    ->where('brand_id', $request->brand_id)
                    ->get();
        return $brands;
    }
}
