<?php

namespace App\Http\Controllers;

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
            ['id', '=', $id]
        ];

        $query = DB::table('view_purchase_details')
                    ->select(['code', 'product_name', 'brand_name', 'qty', 'total']);

        $data = $query->where($where)->get();
        $totalData = $data->count();
        $totalFiltered = $data->count();
        $json_data = array(
            "draw"            => intval($request->input('draw')),  
            "recordsTotal"    => intval($totalData),  
            "recordsFiltered" => intval($totalFiltered), 
            "data"            => $data   
        );
            
        echo json_encode($json_data);
    }
}
