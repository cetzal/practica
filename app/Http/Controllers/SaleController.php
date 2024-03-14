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
        return view('sale.index');
    }

    public function list(Request $request)
    {
        $where = [];
        
        if (!empty($request->range_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where[] = [DB::raw('DATE_FORMAT(sale_date,"%Y-%m-%d")'), '>=', trim($date_from)];
            $where[] = [DB::raw('DATE_FORMAT(sale_date,"%Y-%m-%d")'), '<=', trim($date_to)];
        }

        if (!empty($request->client_id)) {
            $where[] = ['client_id', '=', $request->client_id];
        }
        
        if (!empty($request->status_id)) {
            $where[] = ['status_charge_id', '=', $request->status_id];
        }


        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;
        
        $data = DB::table('view_sales')
                ->select(['id', 'sale_date', 'client_name', 'total', 'status_charge_name', 'total_charged'])
                ->where($where)
                ->orderBy('id', 'DESC')
                ->get();

        $totalData = $data->count();
        $totalFiltered = $totalData;
        $data = $data->skip($start)->take($limit)->values();
        
        return $this->formatResponse($request->draw, $totalData, $totalFiltered, $data);
    }
    
    public function create()
    {
        return view('sale.create');
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

    public function loadSearchComboStatus()
    {
        $option_initial = ['id' => '', 'name' => trans('file.All')];

        $status = DB::table('view_sales_status_list')->get();

        $status->prepend((object)$option_initial);

        return $status;
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

    public function destroy($id)
    {
        $save = DB::select('CALL sp_delete_sale(?)', [$id]);
        Log::emergency('save');
        Log::emergency(print_r($save, true));
        $save = current($save);
        
        if (isset($save->message)) {
            return response()->json([
                'status' => 'success',
                'message' => $save->message
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
}
