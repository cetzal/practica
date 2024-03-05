<?php

namespace App\Http\Controllers;

use App\Traits\DataTableResponse;
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

        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;

        $start = $request->start ?? 1;

        $data = DB::table('view_sale_details')
                ->select(['product_code', 'product_name',
                    'supplier_name','brand_name','quantity','total'])
                ->where($where)
                ->get();

        $total_data = $data->count();
        $total_filtered = $total_data;
        $data = $data->skip($start)->take($limit)->values();

        return $this->formatResponse($request->draw, $total_data, $total_filtered, $data);
    }
}
