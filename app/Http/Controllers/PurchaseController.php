<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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

    public function list(Request $request)
    {
        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;

        $where = [];

        if (!empty($request->range_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where[] = [DB::raw('DATE_FORMAT(purchase_date,"%Y-%m-%d")'), '>=', trim($date_from)];
            $where[] = [DB::raw('DATE_FORMAT(purchase_date,"%Y-%m-%d")'), '<=', trim($date_to)];
        }

        if (!empty($request->supplier_id)) {
            $where[] = ['supplier_id', '=', $request->supplier_id];
        }

        if (!is_null($request->status_id)) {
            $where[] = ['status', '=', $request->status_id];
        }
      
        $data = DB::table('view_purchases')
                ->select(['id', 'purchase_date', 'supplier_name', 'total', 'status', 'paid_amounts'])
                ->where($where)
                ->orderBy('id', 'DESC')
                ->orderBy('purchase_date', 'DESC')
                ->get();

        $totalData = $data->count();
        $totalFiltered = $totalData;
        $data = $data->skip($start)->take($limit)->values();
       
        return $this->formatResponse($request->draw, $totalData, $totalFiltered, $data);
        
    }

    public function store(Request $request){
        $this->validate(
            $request,
            [
                'supplier_id' =>  'required',
                'purchase_date' => 'required',
                'purchase_detail' => ['required', 'array', 'min:1'],
                'purchase_detail.*.product_id' => ['required'],
                'purchase_detail.*.product_qty' => ['required'],
                'purchase_detail.*.product_unit_price' => ['required'],
                'purchase_detail.*.product_subtotal' => ['required']
                
            ]
        );
        
        $reference_no = 'pr-' . date("Ymd") . '-'. date("his");;
        $purchase_date = $request->purchase_date;
        $purchase_status = $request->status;
        $supplier_id = $request->supplier_id;
        $brand_id = $request->brand_id;
        $purchase_item = $request->item;
        $total_qty = $request->total_qty;
        $total = $request->total;
        $note = $request->note;
        $product_detail = $request->purchase_detail;
       
        $save = DB::select(
            'CALL create_purchases(?,?,?,?,?,?)', 
            [ 
                $purchase_date, 
                $reference_no, 
                $supplier_id, 
                $note,
                JWTAuth::toUser()->id, 
                json_encode($product_detail)
            ]
        );
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

    public function destroy($id){
        $save = DB::select("CALL sp_delete_purchases(?)", [$id]);
        $save = current($save);

        if (isset($save->message)) {
            return response()->json([
                'status' => 'succes',
                'message' => $save->message
            ]); 
        }

        if(isset($save->error)) {
            return response()->json([
                'errors' => [
                    'message' => [
                        'The purchases could not be completed please try again, if the error persists, please contact technical support.'
                    ]
                ]
            ], 422);
            exit;
        }
    }

    public function loadCreateComboSuppliers()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_suppliers')];

        $suppliers = DB::table('view_suppliers_purchase_create')->get();

        if ($suppliers->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.supplier_select_supplier')];
        }

        $suppliers->prepend((object)$option_initial);

        return $suppliers;
    }

    public function getBrandsBySupplierId($id)
    {
        $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];

        $brands = DB::table('view_brands_purchase_create')->select(['id', 'name'])->where('supplier_id', $id)->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);          
       
        return $brands;
    }

    public function getProductsByBrandId($id)
    {
        $brands = DB::table('view_products_purchase_list')->select(['id', 'name'])->where('brand_id', $id)->get();

        return $brands;
    }

    public function getproductSearchById($product_id){
        $data = DB::table('view_purchase_product_search')->where('id', $product_id)->first();
        return $data;
    }

    public function searchBrandBySupplierId(Request $request)
    {
        $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];

        $brands = DB::table('view_purchase_brands_list')
                    ->select(['id', 'name'])
                    ->where('supplier_id', $request->supplier_id)
                    ->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);  

        
        return $brands;
    }

    public function searchProductByBrandIdAndSupplierId(Request $request)
    {
        $where = [];
        if (!empty($request->supplier_id) && !is_null($request->supplier_id)) {
            $where[] = ['supplier_id', '=', $request->supplier_id];
        }

        if (!empty($request->brand_id) && !is_null($request->brand_id)) {
            $where[] = ['brand_id', '=', $request->brand_id];
        }

        $option_initial = ['id' => '', 'name' => trans('file.select_without_products')];

        $producs = DB::table('view_purchase_products_list')
        ->select(['id', 'name'])
        ->where($where)
        ->get();

        if ($producs->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_product')];
        }

        $producs->prepend((object)$option_initial);  
       
        return $producs;
    }

    public function loadSearchComboSuppliers()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_suppliers')];
        $suppliers = DB::table('view_purchase_suppliers_list')->get();

        if ($suppliers->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.supplier_select_supplier')];
        }

        $suppliers->prepend((object)$option_initial);
        return $suppliers;
    }

    public function loadSearchComboBrands()
    {

        $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];

        $brands = DB::table('view_purchase_brands_list')->select(['id', 'name'])->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);  

       
        return $brands;
    }

    public function loadSearchComboProducts()
    {
        $option_initial = ['id' => '', 'name' => trans('file.select_without_products')];

        $producs = DB::table('view_purchase_products_list')->select(['id', 'name'])->get();

        if ($producs->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_product')];
        }

        $producs->prepend((object)$option_initial);  
       
        return $producs;
    }

    public function loadSearchComboStatus()
    {
        $option_initial = ['id' => '', 'name' => trans('file.All')];

        $status = DB::table('view_purchase_status_list')->get();

        $status->prepend((object)$option_initial);

        return $status;
    }

    public function getStockAlert(){
        $data = DB::table('view_products_stock_alert')->get();
        return $data;
    }

    public function searchProduct(Request $request)
    {
        $where = [];

        if(!empty($request->code_prod)){
            $where[] = ['code', 'like', '%'.$request->code_prod.'%'];
        }

        if(!empty($request->name_prod)){
            $where[] = ['name', 'like', '%'.$request->name_prod.'%'];
        }

        if (!empty($request->supplier_id)) {
            $where[] = ['supplier_id', '=', $request->supplier_id];
        }

        if(!empty($request->brand_id)){
            $where[] = ['brand_id', '=', $request->brand_id];
        }
        
        $data = DB::table('view_purchase_product_search')
                 ->select(['id','name', 'code', 'qty','price', 'alert_quantity'])
                ->where($where)
                ->get();
            
        return response()->json($data);
    }
}
