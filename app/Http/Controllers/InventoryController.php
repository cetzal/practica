<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
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

        switch ($request->type) {
            case 'purchase':
                $data = $this->getPurchase($request);
                break;
            case 'sale':
                $data = $this->getSale($request);
                break;
            default:
               $data = $this->mergeCV($request);
                break;
        }

        return $data;
    }

    public function getPurchase($request){

        $where = [];
        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;

        if(!empty($request->code_prod)){
            $where[] = ['product_code', 'like', '%'.$request->code_prod.'%'];
        }

        if(!empty($request->name_prod)){
            $where[] = ['product_name', 'like', '%'.$request->name_prod.'%'];
        }

        if (!empty($request->supplier_id)) {
            $where[] = ['supplier_id', '=', $request->supplier_id];
        }

        if (!empty($request->brand_id)) {
            $where[] = ['brand_id', '=', $request->brand_id];
        }

        if (!empty($request->product_id)) {
            $where[] = ['product_id', '=', $request->product_id];
        }

        if (!empty($request->range_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where[] = [DB::raw('DATE_FORMAT(date,"%Y-%m-%d")'), '>=', trim($date_from)];
            $where[] = [DB::raw('DATE_FORMAT(date,"%Y-%m-%d")'), '<=', trim($date_to)];
        }

        
        $data = DB::table('view_purchase_details')
        ->where($where)
                    ->orderBy('date')
                    ->orderBy('product_id')
                    ->get();
        $totalData = $data->count();
        $totalFiltered = $totalData;
        $data = $data->skip($start)->take($limit)->values();

        return $this->formatResponse($request->draw, $totalData, $totalFiltered, $data);
    }

    public function getSale($request){

        $where = [];
        $where = [];
        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;
        
        if(!empty($request->code_prod)){
            $where[] = ['product_code', 'like', '%'.$request->code_prod.'%'];
        }

        if(!empty($request->name_prod)){
            $where[] = ['product_name', 'like', '%'.$request->name_prod.'%'];
        }

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
        ->where($where)
                    ->orderBy('date')
                    ->orderBy('product_id')
                    ->get();

        $totalData = $data->count();
        $totalFiltered = $totalData;
        $data = $data->skip($start)->take($limit)->values();

        return $this->formatResponse($request->draw, $totalData, $totalFiltered, $data);
    }

    public function mergeCV($request){

        $where = [];
        $where_sales = [];
        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;

        if(!empty($request->code_prod)){
            $where[] = ['product_code', 'like', '%'.$request->code_prod.'%'];
        }

        if(!empty($request->name_prod)){
            $where[] = ['product_name', 'like', '%'.$request->name_prod.'%'];
        }

        if (!empty($request->supplier_id)) {
            $where[] = ['supplier_id', '=', $request->supplier_id];
        }

        if (!empty($request->brand_id)) {
            $where[] = ['brand_id', '=', $request->brand_id];
        }

        if (!empty($request->product_id)) {
            $where[] = ['product_id', '=', $request->product_id];
        }

        if (!empty($request->range_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where[] = [DB::raw('DATE_FORMAT(date,"%Y-%m-%d")'), '>=', trim($date_from)];
            $where[] = [DB::raw('DATE_FORMAT(date,"%Y-%m-%d")'), '<=', trim($date_to)];
        }


        
        $purchases = DB::table('view_purchase_details')
        ->where($where)
        ->orderBy('date')
        ->get();

        $sales = DB::table('view_sale_details')
        ->where($where)
        ->orderBy('date')
        ->get();

        $data = [];
        foreach ($purchases as $key => $item) {
            $c_qty = $item->qty;
            $item->client_name = trans('file.none');
            $data[] = (array) $item;
            $filter_by_porduct = $sales->where('product_id', $item->product_id)->all();
           
            if(count($filter_by_porduct) > 0){
                $total_qty = 0;
                foreach ($filter_by_porduct as $key_f => $filter) {
                    $total_qty+=$filter->quantity;
                    if($total_qty <= $c_qty){
                        $data[] = (array) $filter;
                        $sales->pull($key_f);
                    }
                    
                }
            }
            
        }

        $data = new Collection($data);
        $totalData = $data->count();
        $totalFiltered = $totalData;
        $data = $data->skip($start)->take($limit)->values();

        return $this->formatResponse($request->draw, $totalData, $totalFiltered, $data);
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
