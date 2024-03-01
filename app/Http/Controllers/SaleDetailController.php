<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleDetailController extends Controller
{
    public function index(Request $request, $id)
    {
        $sale_id = $id;
        $sale_date = Carbon::createFromFormat('Y-m-d', $request->sale_date)->format('d/m/Y');
        $client = $request->client;
        
        return view('sale-detail.index', compact('sale_id', 'sale_date', 'client'));
    }

    public function showList(Request $request, $id)
    {
        $where = [
            ['id', '=', $id]
        ];
        
        $data = DB::table('view_sale_details')
                ->select(['product_code', 'product_name',
                    'supplier_name','brand_name','quantity','total'])
                ->where($where)
                ->get();

        $json_data = array(
            "draw"            => intval($request->input('draw')),  
            "recordsTotal"    => intval($data->count()),  
            "recordsFiltered" => intval($data->count()), 
            "data"            => $data
        );

        return response()->json($json_data);
    }
}
