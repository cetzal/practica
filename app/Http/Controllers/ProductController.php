<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Keygen\Keygen;
use App\Models\Unit;
use App\Models\Product;
use App\Enum\ModuleEnum;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Enum\MovementTypeEnum;
use App\Traits\LogModuleTrait;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    use LogModuleTrait;

    public function index()
    {
        // $lims_product_brand_list = DB::table('view_products_brands')->get();
        //$lims_supplier_products_list = DB::table('view_suppliers_products_list')->get();
        //$lims_brands_products_list = DB::table('view_brands_products_list')->select('id', 'name')->get();
        $lims_product_category_list = DB::table('view_products_categories')->get();
        return view('product.index', compact('lims_product_category_list'));
    }

    public function list(Request $request)
    {
        $where = [];

        if(!empty($request->code_prod)){
            $where[] = ['code', 'like', '%'.$request->code_prod.'%'];
        }

        if(!empty($request->name_prod)){
            $where[] = ['name', 'like', '%'.$request->name_prod.'%'];
        }

        if(!empty($request->brand_prod)){
            $where[] = ['brand_id', '=', $request->brand_prod];
        }
        if(!empty($request->category_id)){
            $where[] = ['category_id', '=', '%'.$request->category_id.'%'];
        }
        
        if(!empty($request->user_created)){
            $where[] = ['asuser_name', 'like', '%'.$request->user_created.'%'];
        }

        if (!empty($request->supplier_id)) {
            $where[] = ['supplier_id', '=', $request->supplier_id];
        }
        
        if (!empty($request->date_range) && !empty($request->select_date)) {
            list($start_date, $end_date)= explode(' - ', $request->date_range);
            $where[] = [DB::raw('DATE_FORMAT('. $request->select_date.',"%Y-%m-%d")'), '>=', Carbon::createFromFormat('d/m/Y', $start_date)->format('Y-m-d')];
            $where[] = [DB::raw('DATE_FORMAT('. $request->select_date.',"%Y-%m-%d")'), '<=', Carbon::createFromFormat('d/m/Y', $end_date)->format('Y-m-d')];
        }
        
        if($request->prod_status != '') {
            $where[] = ['is_active', '=' ,$request->prod_status];
        }
        
        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;

        $data = DB::table('view_products')
                 ->select([
                    'id','name', 'code', 'supplier_name','brand_name', 'category_name',
                    'picture', 'qty', 'unit_name', 'price',
                    'is_active','created_at', 'updated_at'
                ])
                ->where($where)
                ->get();
        
        $totalData = $data->count();
        $totalFiltered = $totalData;
       
        $json_data = array(
            "draw"            => intval($request->input('draw')),  
            "recordsTotal"    => intval($totalData),  
            "recordsFiltered" => intval($totalFiltered), 
            "data"            => $data->skip($start)->take($limit)->values()   
        );
            
        echo json_encode($json_data);
    }
    
    public function create()
    {
        //$lims_brand_list = DB::table('view_brands_active')->get();
        $lims_category_list = DB::table('view_categories_active')->get();
        $lims_unit_list = DB::table('view_units_active')->get();
        $lims_tax_list = DB::table('view_taxes_active')->get();

        return view('product.create',compact( 'lims_category_list', 'lims_unit_list', 'lims_tax_list'));
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'code' => [
                'required',
                'max:255',
                    Rule::unique('products')->where(function ($query) {
                    return $query->where('is_active', 1);
                }),
            ],
            'name' => [
                'required',
                'max:255',
                    Rule::unique('products')->where(function ($query) {
                    return $query->where('is_active', 1);
                }),
            ]
        ]);
        $data = $request->except('image', 'file');
        $data['user_id'] = JWTAuth::toUser()->id;
        $data['product_details'] = str_replace('"', '@', $data['product_details']);

        if($data['starting_date'])
            $data['starting_date'] = date('Y-m-d', strtotime($data['starting_date']));
        if($data['last_date'])
            $data['last_date'] = date('Y-m-d', strtotime($data['last_date']));
        $data['is_active'] = true;
        $images = $request->image;
        $image_names = [];
        if($images) {            
            foreach ($images as $key => $image) {
                $imageName = $image->getClientOriginalName();
                $image->move('public/images/product', $imageName);
                $image_names[] = $imageName;
            }
            $data['image'] = implode(",", $image_names);
        }
        else {
            $data['image'] = 'dummy2.png';
        }
        
        $product = Product::create($data);

        if ($product->getKey()) {
            $this->log(
                [], 
                Arr::except($product->getOriginal(), ['id']),
                $product->getKey(),
                ModuleEnum::PRODUCTS,
                MovementTypeEnum::CREATION
            );
        }
        
        return response()->json(['status' => 'success', 'message' => 'El producto se guardo con exito']);
    }

    public function edit($id)
    {
        $brand_list = DB::table('view_brands_for_edit')->get();
        $category_list = DB::table('view_categories_active')->get();
        $unit_list = DB::table('view_units_active')->get();
        $tax_list = DB::table('view_taxes_active')->get();
        $product_data = DB::table('view_products')->where('id', $id)->first();

        return view('product.edit',compact('brand_list','category_list', 'unit_list', 'tax_list', 'product_data'));
    }

    public function update( $id, Request $request)
    {
        $this->validate($request, [
            'name' => [
                'max:255',
                Rule::unique('products')->ignore($id)->where(function ($query) {
                    return $query->where('is_active', 1);
                }),
            ],

            'code' => [
                'max:255',
                Rule::unique('products')->ignore($id)->where(function ($query) {
                    return $query->where('is_active', 1);
                }),
            ]
        ]);
        $product_data = Product::findOrFail($id);
        $previous_value = Arr::except($product_data->getOriginal(), ['id']);
        $data = $request->except('image', '_method');
        $data['product_details'] = str_replace('"', '@', $data['product_details']);
        $data['product_details'] = $data['product_details'];
        if($data['starting_date'])
            $data['starting_date'] = date('Y-m-d', strtotime($data['starting_date']));
        if($data['last_date'])
            $data['last_date'] = date('Y-m-d', strtotime($data['last_date']));
        $images = $request->image;
        $image_names = [];
        if($images) {            
            foreach ($images as $key => $image) {
                $imageName = $image->getClientOriginalName();
                $image->move('public/images/product', $imageName);
                $image_names[] = $imageName;
            }
            if($product_data->image != 'dummy2.png') {
                $data['image'] = $product_data->image.','.implode(",", $image_names);
            }
            else{
                $data['image'] = implode(",", $image_names);
            }
        }
        else {
            $data['image'] = $product_data->image;
        }

       
        $product_data->update($data);

        if ($product_data->getChanges()) {
            $current_values = Arr::except($product_data->getChanges(), ['id']);
            $this->log(
                Arr::only($previous_value, array_keys($current_values)), 
                $current_values,
                $product_data->getKey(),
                ModuleEnum::PRODUCTS,
                MovementTypeEnum::UPDATING
            );
        }
        return response()->json(['status' => 'success', 'message' => 'El producto se actualizado con exito']);
    }

    public function generateCode()
    {
        $id = Keygen::numeric(8)->generate();
        return $id;
    }

    public function saleUnit($id)
    {
        $unit = Unit::where("base_unit", $id)->orWhere('id', $id)->pluck('unit_name','id');
        return json_encode($unit);
    }

    public function getData($id)
    {
        $data = Product::select('name', 'code')->where('id', $id)->get();
        return $data[0];
    }

    public function activate($id){
        $data_user = Product::find($id);
        $previous_value = Arr::except($data_user->getOriginal(), ['id']);
        $data_user->is_active = true;
        $data_user->save();

        if($current_value = $data_user->getChanges()) {
            $this->log(
                $previous_value,
                Arr::except($current_value, ['id']),
                $data_user->getKey(),
                ModuleEnum::USERS,
                MovementTypeEnum::UPDATING
            );
        }

        return response()->json(['status' => 'success', 'message' => 'El producto se ha activado con exito']);
    }

    public function deactivate($id) {
        $data_user = Product::find($id);
        $previous_value = Arr::except($data_user->getOriginal(), ['id']);
        $data_user->is_active = false;
        $data_user->save();

        if($current_value = $data_user->getChanges()) {
            $this->log(
                $previous_value,
                Arr::except($current_value, ['id']),
                $data_user->getKey(),
                ModuleEnum::USERS,
                MovementTypeEnum::UPDATING
            );
        }

        return response()->json(['status' => 'success', 'message' => 'El producto se ha desactivado con exito']);
    }

    public function deactivateBySelection(Request $request)
    {
        $product_id = $request->productIdArray;
        foreach ($product_id as $id) {
            $lims_product_data = Product::findOrFail($id);
            $lims_product_data->is_active = false;
            $lims_product_data->save();
        }
       
        return response()->json(['status' => 'success', 'message' => 'Los productos selecionado se ha desactivado con exito']);
    }

    public function activateBySelection(Request $request)
    {
        $product_id = $request->productIdArray;
        foreach ($product_id as $id) {
            $lims_product_data = Product::findOrFail($id);
            $lims_product_data->is_active = true;
            $lims_product_data->save();
        }
       
        return response()->json(['status' => 'success', 'message' => 'Los productos selecionado se ha activado con exito']);
    }

    public function deleteBySelection(Request $request)
    {
        $product_id = $request->productIdArray;
        $delete_date = date('Y-m-d H:i:s');
        foreach ($product_id as $id) {
            $product_data = Product::findOrFail($id);
            $product_data->is_active = false;
            if($product_data->image != 'dummy2.png') {
                $images = explode(",", $product_data->image);
                foreach ($images as $key => $image) {
                    if(file_exists('public/images/product/'.$image)){
                        unlink('public/images/product/'.$image);
                    }
                }
                $product_data->image = 'dummy2.png';
            }
            $product_data->deleted_at = $delete_date;
            $product_data->save();
        }
       
        return response()->json(['status' => 'success', 'message' => 'Los productos selecionado se ha eliminado con exito']);
    }

   
    public function destroy($id)
    {
        $product_data = Product::findOrFail($id);
        $product_data->is_active = false;
        if($product_data->image != 'dummy2.png') {
            $images = explode(",", $product_data->image);
            foreach ($images as $key => $image) {
                if(file_exists('public/images/product/'.$image)){
                    unlink('public/images/product/'.$image);
                }
            }
            $product_data->image = 'dummy2.png';
        }
        
        $product_data->deleted_at = date('Y-m-d H:i:s');
        $product_data->save();
     
        return response()->json(['status' => 'success', 'message' => 'El producto se ha eliminado con exito']);
    }

    public function validateCode(Request $request)
    {
        if(empty($request->code)){
            return response()->json(true);
            exit;
        }

        if(DB::table('view_products')->where('code', $request->code)->count() > 0){
            return response()->json([
                'errors' => [
                    'code' => [
                        'The code is being used, please try another'
                    ]
                ]
            ], 422);
            exit;
        }
        return response()->json(true);
    }
    public function productByIdBrandCombo($id){
        $data = DB::table('view_products_active')->select(['id', 'name', 'brand_id'])->where('brand_id', $id)->get();
        return $data;
    }

    public function getProductById($id)
    {
        $product = DB::table('view_products')
                    ->select(['id', 'code', 'name', 'price', 'qty', 'alert_quantity'])
                    ->where([
                        ['is_active', '=', 1],
                        ['id', '=', $id]
                    ])
                    ->first();
        return $product;
    }

    public function getBrandsBySupplierId($id)
    {
        if($id == 0){
            $option_initial = ['id' => '', 'name' => trans('file.select_the_supplier')];
        }else{
            $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];
        }
        

        $brands = DB::table('view_products_brands_edit')
        ->select(['id', 'name', 'is_active'])
        ->where('supplier_id', $id)
        ->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);

        
        return $brands;
    }

    public function loadSearchComboSuppliers()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_suppliers')];

        $suppliers = DB::table('view_suppliers_products_list')->get();
        
        if ($suppliers->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.supplier_select_supplier')];
        }

        $suppliers->prepend((object)$option_initial);

        return $suppliers;
    }

    public function loadSearchComboBrands()
    {
        $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];

        $brands = DB::table('view_brands_products_list')->select(['id', 'name'])->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);

        return $brands;
    }

    public function getBrandsBySupplierIdCombo($id)
    {
        $option_initial = ['id' => '', 'name' => trans('file.select_non_branded')];

        $brands = DB::table('view_products_brands_list')->select(['id', 'name'])->where('supplier_id', $id)->get();

        if ($brands->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_brand')];
        }

        $brands->prepend((object)$option_initial);

        return $brands;
    }
}
