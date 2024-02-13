<?php

namespace App\Http\Controllers;

use Auth;
use DNS1D;
use Carbon\Carbon;
use Keygen\Keygen;
use App\Models\Tax;
use App\Models\Unit;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Category;
use App\Models\LogModule;
use App\Traits\LogModuleTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    use LogModuleTrait;

    public function index()
    {
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
            $where[] = ['brand_name', 'like', '%'.$request->brand_prod.'%'];
        }
        if(!empty($request->category_id)){
            $where[] = ['category_id', '=', '%'.$request->category_id.'%'];
        }
        
        if(!empty($request->user_created)){
            $where[] = ['asuser_name', 'like', '%'.$request->user_created.'%'];
        }
        
        if (!empty($request->date_range) && !empty($request->select_date)) {
            list($start_date, $end_date)= explode(' - ', $request->date_range);
            $where[] = [DB::raw('DATE_FORMAT('. $request->select_date.',"%Y-%m-%d")'), '>=', Carbon::createFromFormat('d/m/Y', $start_date)->format('Y-m-d')];
            $where[] = [DB::raw('DATE_FORMAT('. $request->select_date.',"%Y-%m-%d")'), '<=', Carbon::createFromFormat('d/m/Y', $end_date)->format('Y-m-d')];
        }
        
        if($request->prod_status != '') {
            $where[] = ['is_active', '=' ,$request->prod_status];
        }

        $data = DB::table('view_products')
                 ->select([
                    'id','name', 'code', 'brand_name', 'category_name',
                    'picture', 'qty', 'unit_name', 'price',
                    'is_active','created_at', 'updated_at'
                ])
                ->where($where)
                ->get();

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
    
    public function create()
    {
        $lims_brand_list = DB::table('view_brands_active')->get();
        $lims_category_list = DB::table('view_categories_active')->get();
        $lims_unit_list = DB::table('view_units_active')->get();
        $lims_tax_list = DB::table('view_taxes_active')->get();
        return view('product.create',compact('lims_brand_list', 'lims_category_list', 'lims_unit_list', 'lims_tax_list'));
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'code' => [
                'max:255',
                    Rule::unique('products')->where(function ($query) {
                    return $query->where('is_active', 1);
                }),
            ],
            'name' => [
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
            $data['image'] = 'zummXD2dvAtI.png';
        }
        
        $product = Product::create($data);

        if ($product->getKey()) {
            LogModule::create($this->logFormat(
                [
                    'previous' => [],
                    'current' => $product->getOriginal(),
                    'module' => 'Productos',
                    'movement_type' => 'Creacion'
                ]
            ));
        }
        
        return response()->json(['status' => 'success', 'messages' => 'El producto se guardo con exito']);
    }

    public function edit($id)
    {
        // $lims_product_list = Product::where([ ['is_active', true], ['type', 'standard'] ])->get();
        $lims_brand_list = DB::table('view_brands_active')->get();
        $lims_category_list = DB::table('view_categories_active')->get();
        $lims_unit_list = DB::table('view_units_active')->get();
        $lims_tax_list = DB::table('view_taxes_active')->get();
        $lims_product_data = DB::table('view_products')->where('id', $id)->first();

        return view('product.edit',compact('lims_brand_list', 'lims_category_list', 'lims_unit_list', 'lims_tax_list', 'lims_product_data'));
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
        $previous_value = $product_data->getOriginal();
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
            if($product_data->image != 'zummXD2dvAtI.png') {
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
            LogModule::create($this->logFormat(
                [
                    'previous' => Arr::only($previous_value, array_keys($product_data->getOriginal())),
                    'current' => $product_data->getOriginal(),
                    'module' => 'Productos',
                    'movement_type' => 'Actualizacion'
                ]
            ));
        }
        return response()->json(['status' => 'success', 'messages' => 'El producto se actualizado con exito']);
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
        $data_user->is_active = true;
        $data_user->save();
        return response()->json(['status' => 'success', 'message' => 'El producto se ha activado con exito']);
    }

    public function deactivate($id) {
        $data_user = Product::find($id);
        $data_user->is_active = false;
        $data_user->save();
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
       
        return response()->json(['status' => 'success', 'messages' => 'Los productos selecionado se ha desactivado con exito']);
    }

    public function activateBySelection(Request $request)
    {
        $product_id = $request->productIdArray;
        foreach ($product_id as $id) {
            $lims_product_data = Product::findOrFail($id);
            $lims_product_data->is_active = true;
            $lims_product_data->save();
        }
       
        return response()->json(['status' => 'success', 'messages' => 'Los productos selecionado se ha activado con exito']);
    }

    public function deleteBySelection(Request $request)
    {
        $product_id = $request->productIdArray;
        foreach ($product_id as $id) {
            $lims_product_data = Product::findOrFail($id);
            $lims_product_data->is_active = false;
            $lims_product_data->save();
            $lims_product_data->delete();
        }
       
        return response()->json(['status' => 'success', 'messages' => 'Los productos selecionado se ha eliminado con exito']);
    }

   
    public function destroy($id)
    {
        $lims_product_data = Product::findOrFail($id);
        $lims_product_data->is_active = false;
        if($lims_product_data->image != 'zummXD2dvAtI.png') {
            // $images = explode(",", $lims_product_data->image);
            // foreach ($images as $key => $image) {
            //     if(file_exists('public/images/product/'.$image)){
            //         unlink('public/images/product/'.$image);
            //     }
            // }
        }
        $lims_product_data->save();
        $lims_product_data->delete();
     
        return response()->json(['status' => 'success', 'messages' => 'El producto se ha eliminado con exito']);
    }

    public function validateCode(Request $request)
    {   
        if(empty($request->code)){
            return null;
            exit;
        }


        if(DB::table('view_products')->where('code', $request->code)->count() > 0){
            echo 0;
            exit;
        }
        return null;
    }
}
