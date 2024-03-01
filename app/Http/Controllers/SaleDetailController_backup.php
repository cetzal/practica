<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class SaleDetailController_backup extends Controller
{
    public function index()
    {  
        // $lims_sales_suppliers_list = DB::table('view_sales_suppliers_list')->get();
        // $lims_sales_brands_list = DB::table('view_sales_brands_list')->select(['id', 'name'])->get();
        // $lims_sales_products_list = DB::table('view_sales_products_list')->select(['id', 'name'])->get();
        // $lims_sales_clients_list = DB::table('view_sales_clients_list')->get();
        return view('sale-detail.index');
    }

    public function list(Request $request)
    {
        $where = [];
        
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
                ->select(['date', 'client_name', 'product_code', 'product_name',
                    'supplier_name','brand_name','quantity', 'total'])
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
    
    public function create()
    {
        // $lims_clients_list = DB::table('view_clients_active')->get();
        // $lims_suppliers_list = DB::table('view_suppliers_sales_create')->get();
        return view('sale-detail.create');
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
                    "CALL sp_create_sale(?,?,?,?)", 
                    [
                        $request->client_id, 
                        $request->date,
                        $request->comments, 
                        json_encode($request->product_details)
                    ]
                );
        $save = current($save);
        
        if (isset($save->message)) {
            $product_ids = array_column($request->product_details, 'product_id');
            $products = DB::table('view_products_active')
                        ->select('name', 'qty', 'alert_quantity')
                        ->whereIn('id', $product_ids)
                        ->whereColumn('qty', '<', 'alert_quantity')
                        ->get();

            $message[] =  $save->message;
            
            if ($products->count()) {
                $message  = array_merge (
                    $message, 
                    array_map(function($item) {
                        return 'El producto <b>'.$item->name.'</b> en existencia cuenta con <b>'.$item->qty.'</b>'
                                .', se recomienda realizar el punto de reorden esta por debajo de <b>'.$item->alert_quantity.'</b>.';
                    }, $products->toArray())
                );
            }

            return response()->json([
                'status' => 'succes',
                'message' => implode('<br>', $message)
            ]); 
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
        $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];

        $brands = DB::table('view_brands_sales_create')->select(['id', 'name'])->where('supplier_id', $id)->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);

        return $brands;
    }

    public function getProductsByBrandId($id)
    {
        // $brands = DB::table('view_products_list')->select(['id', 'name'])->where('brand_id', $id)->get();
        $brands = DB::table('view_products_sales_create')->select(['id', 'name'])->where('brand_id', $id)->get();

        return $brands;
    }

    public function searchBrandBySupplierId(Request $request)
    {
        $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];

        $brands = DB::table('view_sales_brands_list')
                    ->select(['id', 'name'])
                    ->where('supplier_id', $request->supplier_id)
                    ->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);          
        return $brands;
    }

    public function searchProductByBrandId(Request $request)
    {
        $option_initial = ['id' => '', 'name' => trans('file.select_without_products')];

        $products = DB::table('view_sales_products_list')
                    ->select(['id', 'name'])
                    ->where('brand_id', $request->brand_id)
                    ->get();
        if ($products->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.Select Product')];
        }

        $products->prepend((object)$option_initial);

        return $products;
    }

    public function loadCreateComboSuppliers()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_suppliers')];
        
        $suppliers = DB::table('view_suppliers_sales_create')->get();

        if ($suppliers->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.supplier_select_supplier')];
        }

        $suppliers->prepend((object)$option_initial);
        return $suppliers;
    }

    public function loadCreateComboBrands()
    {
        $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];

        $brands = DB::table('view_brands_sales_create')->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);

        return $brands;
    }

    public function loadCreateComboClients()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_clients')];

        $clients = DB::table('view_clients_active')->get();

        if ($clients->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_client')];
        }

        $clients->prepend((object)$option_initial);

        return $clients;
    }
    
    public function loadSearchComboSuppliers()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_suppliers')];

        $suppliers = DB::table('view_sales_suppliers_list')->get();
        
        if ($suppliers->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.supplier_select_supplier')];
        }

        $suppliers->prepend((object)$option_initial);

        return $suppliers;
    }

    public function loadSearchComboBrands()
    {
        $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];

        $brands = DB::table('view_sales_brands_list')->select(['id', 'name'])->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);

        return $brands;
    }

    public function loadSearchComboProducts(Request $request)
    {
        $where = [];
        if (isset($request->supplier_id)) {
            $where[] = ['supplier_id', '=', $request->supplier_id];
        }
       
        $option_initial = ['id' => '', 'name' => trans('file.select_without_products')];
        $products = DB::table('view_sales_products_list')
                    ->select(['id', 'name'])
                    ->where($where)
                    ->get();
        if ($products->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.Select Product')];
        }

        $products->prepend((object)$option_initial);

        return $products;
    }

    public function loadSearchComboClients()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_clients')];

        $clients = DB::table('view_sales_clients_list')->get();

        if ($clients->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_client')];
        }

        $clients->prepend((object)$option_initial);

        return $clients;
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

        $where[] = [
            'qty', '>', 0
        ];
        
        $data = DB::table('view_products_sales_create')
                 ->select(['id','name', 'code', 'qty', 'price', 'alert_quantity'])
                ->where($where)
                ->get();

        // $totalData = $data->count();
        // $totalFiltered = $data->count();
        // $json_data = array(
        //     "draw"            => intval($request->input('draw')),  
        //     "recordsTotal"    => intval($totalData),  
        //     "recordsFiltered" => intval($totalFiltered), 
        //     "data"            => $data   
        // );
            
        return response()->json($data);
    }
}
