<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Tax;
use App\Models\Unit;
use Auth;
use Carbon\Carbon;
use DNS1D;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Keygen\Keygen;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProductController extends Controller
{
    public function index()
    {
        return view('product.index');
    }

    public function list(Request $request)
    {
        $where = [];

        if(!empty($request->input('code_prod'))){
            $where[] = ['code', 'like', '%'.$request->input('code_prod').'%'];
        }

        if(!empty($request->input('name_prod'))){
            $where[] = ['name', 'like', '%'.$request->input('name_prod').'%'];
        }

        if(!empty($request->input('brand_prod'))){
            $where[] = ['brand_name', 'like', '%'.$request->input('brand_prod').'%'];
        }

        if(!empty($request->input('user_created'))){
            $where[] = ['asuser_name', 'like', '%'.$request->input('name_prod').'%'];
        }

        $select_date = 'created_at';
        if(!is_null($request->get('select_date'))){
            $select_date = $request->get('select_date');
        }

        if(!is_null($request->get('date_range'))){
            list($start_date, $end_date)= explode(' - ', $request->get('date_range'));
            $where[] = [$select_date, '>=', Carbon::createFromFormat('d/m/Y', $start_date)->format('d-m-Y')];
            $where[] = [$select_date, '<=', Carbon::createFromFormat('d/m/Y', $end_date)->format('d-m-Y')];
        }

       

        // if(!is_null($request->get('date_create'))){
        //     list($start_date, $end_date) = explode(' - ', $request->get('date_create'));
        //     $where[] = ['created_at', '>=', Carbon::createFromFormat('d/m/Y', $start_date)->format('d-m-y')];
        //     $where[] = ['created_at', '>=', Carbon::createFromFormat('d/m/Y', $end_date)->format('d-m-y')];

        //     // $where[] = 'DATE(created_at) BETWEEN "'..'" and "'.Carbon::createFromFormat('d/m/Y', $range[1])->format('Y-m-d').'"';
        // }
        // if(!is_null($request->get('date_update'))){
        //     $range = explode(' - ', $request->get('date_update'));
        //     $where[] = 'DATE(updated_at) BETWEEN "'.Carbon::createFromFormat('d/m/Y', $range[0])->format('Y-m-d').'" and "'.Carbon::createFromFormat('d/m/Y', $range[1])->format('Y-m-d').'"';
           
        // }

        if(!is_null($request->get('prod_status'))){
            $where[] = ['is_active', '=' ,$request->get('prod_status')];
        }

       
        $query = DB::table('view_products');

        if(count($where) > 0){
            $query = $query->where($where);
        }

        $data = $query->get();

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
        $lims_product_list = DB::table('view_products')->where([ ['is_active', 1], ['type', 'standard'] ])->get();
        $lims_brand_list = DB::table('view_brands')->where('is_active', 1)->get();
        $lims_category_list = Category::where('is_active', 1)->get();
        $lims_unit_list = Unit::where('is_active', 1)->get();
        // var_dump($lims_unit_list->toarray());
        // exit;
        $lims_tax_list = Tax::where('is_active', 1)->get();
        return view('product.create',compact('lims_product_list', 'lims_brand_list', 'lims_category_list', 'lims_unit_list', 'lims_tax_list'));
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
        
       Product::create($data);
        
        return response()->json(['status' => 'success', 'messages' => 'El producto se guardo con exito']);
    }

    public function edit($id)
    {
        $lims_product_list = Product::where([ ['is_active', true], ['type', 'standard'] ])->get();
        $lims_brand_list = Brand::where('is_active', true)->get();
        $lims_category_list = Category::where('is_active', true)->get();
        $lims_unit_list = Unit::where('is_active', true)->get();
        $lims_tax_list = Tax::where('is_active', true)->get();
        $lims_product_data = Product::where('id', $id)->first();

        return view('product.edit',compact('lims_product_list', 'lims_brand_list', 'lims_category_list', 'lims_unit_list', 'lims_tax_list', 'lims_product_data'));
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

    public function activar($id){
        $data_user = Product::find($id);
        $data_user->is_active = true;
        $data_user->save();
        return response()->json(['status' => 'success', 'message' => 'El producto se ha activado con exito']);
    }

    public function desactivar($id) {
        $data_user = Product::find($id);
        $data_user->is_active = false;
        $data_user->save();
        return response()->json(['status' => 'success', 'message' => 'El producto se ha desactivado con exito']);
    }

    public function desactivarBySelection(Request $request)
    {
        $product_id = $request['productIdArray'];
        foreach ($product_id as $id) {
            $lims_product_data = Product::findOrFail($id);
            $lims_product_data->is_active = false;
            $lims_product_data->save();
        }
       
        return response()->json(['status' => 'success', 'messages' => 'Los productos selecionado se ha desactivado con exito']);
    }

    public function activarBySelection(Request $request)
    {
        $product_id = $request['productIdArray'];
        foreach ($product_id as $id) {
            $lims_product_data = Product::findOrFail($id);
            $lims_product_data->is_active = true;
            $lims_product_data->save();
        }
       
        return response()->json(['status' => 'success', 'messages' => 'Los productos selecionado se ha activado con exito']);
    }

    public function deleteBySelection(Request $request)
    {
        $product_id = $request['productIdArray'];
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
}
