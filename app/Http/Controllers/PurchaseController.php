<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Tymon\JWTAuth\Facades\JWTAuth;

class PurchaseController extends Controller
{
    public function index(){
        return view('purchases.index');
    }

    public function create(){
        return view('purchases.create');
    }

    public function list(){
        
    }

    public function store(Request $request){
        // 'product_id' => [
        //     'required|array'
        // ],
        // 'product_id.*' => [
        //     'required|array'
        // ],
        // 'product_code' => [
        //     'required|array'
        // ],
        // 'net_unit_cost' => [
        //     'required|array'
        // ],
        // 'qty' => [
        //     'required|array'
        // ],
        // 'subtotal' => [
        //     'required|array'
        // ],
        $this->validate(
            $request,
            [
                'reference_no' => [
                    'required',
                    'max:255',
                    Rule::unique('purchases')
                ],
                'supplier_id' => [
                    'required'
                ],
                'purchase_date' => [
                    'required'
                ],
                'status' => 'required',
                
            ]
        );
        
        $reference_no = $request->reference_no;
        $purchase_date = $request->purchase_date;
        $purchase_status = $request->status;
        $supplier_id = $request->supplier_id;
        $brand_id = $request->brand_id;
        $purchase_item = $request->item;
        $total_qty = $request->total_qty;
        $total = $request->total;
        $product_detail = $request->purchase_detail;
       
        $data = DB::select('CALL guardar_compra(?,?,?,?,?,?,?,?,?,?)', [ $purchase_date, $reference_no, $supplier_id, $purchase_item, $total_qty, $total, $purchase_status, 'omar',JWTAuth::toUser()->id, json_encode($product_detail)]);
        return $data;
    }

    public function productSearchById($product_id){
        $data = DB::table('view_products_for_purchase')->where('id', $product_id)->first();
        return $data;
    }
}
