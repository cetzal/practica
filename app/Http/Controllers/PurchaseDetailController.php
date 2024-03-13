<?php

namespace App\Http\Controllers;

use App\Traits\DataTableResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PurchaseDetailController extends Controller
{
    public function index(Request $request, $id)
    {
        $purchase_id = $id;
        $purchase_date = Carbon::createFromFormat('Y-m-d', $request->purchase_date)->format('d/m/Y');
        $supplier = $request->supplier;
        
        return view('purchase-detail.index', compact('purchase_id', 'purchase_date', 'supplier'));
    }

    public function showList(Request $request, $id)
    {
        $where = [
            ['purchase_id', '=', $id]
        ];

        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;

        $start = $request->start ?? 1;

        $query = DB::table('view_purchase_details')
                    ->select(['product_code', 'product_name', 'brand_name', 'qty', 'total']);

        $data = $query->where($where)->get();
        $total_data = $data->count();
        $total_filtered = $total_data;
        $data = $data->skip($start)->take($limit)->values();

        return $this->formatResponse($request->draw, $total_data, $total_filtered, $data);
    }
}
