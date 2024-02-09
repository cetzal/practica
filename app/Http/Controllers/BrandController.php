<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\Brand;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BrandController extends Controller
{

    public function index()
    {
        $brand_all = DB::table('view_brands')->get();
        return view('brand.create', compact('brand_all'));
    }

    public function list(Request $request)
    {
        $this->validate($request, [
            'brand' => ['sometimes', 'required', 'max:255'],
            'is_active' => ['sometimes', 'boolean']
        ]);
        
        $where_conditions = [];
        if (!empty($request['name'])) {
            $where_conditions[] = ['name', 'like', '%'.$request['name'].'%'];
        }
        if (!empty($request['created_by'])) {
            $where_conditions[] = ['user_name', 'like', '%'.$request['created_by'].'%'];
        }

        if (isset($request['status']) && $request['status'] != '') {
            $where_conditions[] = ['is_active', '=', $request['status']];
        }

        if (!empty($request['range_date']) && !empty($request['select_date'])) {
            list($date_from, $date_to) = explode(' - ', $request['range_date']);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where_conditions[] = [DB::raw('DATE_FORMAT('. $request['select_date'].',"%Y-%m-%d")'), '>=', trim($date_from)];
            $where_conditions[] = [DB::raw('DATE_FORMAT('. $request['select_date'].',"%Y-%m-%d")'), '<=', trim($date_to)];
        }
        
        $data = DB::table('view_brands')
                ->select(['id', 'name', 'description', 'is_active', 'created_by', 'created_at', 'updated_at'])
                ->where($where_conditions)
                ->get();
        
        $json_data = array(
            "draw"            => intval($request->input('draw')),  
            "recordsTotal"    => intval($data->count()),  
            "recordsFiltered" => intval($data->count()), 
            "data"            => $data
        );

        return response()->json($json_data);
    }

    public function store(Request $request)
    {
        $request->name = preg_replace('/\s+/', ' ', $request->name);
        $this->validate($request, [
            'name' => [
                'max:255',
                Rule::unique('view_brands')->where(function ($query) {
                    return $query->where('is_active', 1);
                })
            ],
            'description' => ['required']
        ]);
        
        $input = $request->except('image');
        $input['is_active'] = true;
        $input['created_by'] = JWTAuth::toUser()->id;
        Brand::create($input);
        return response()->json(['status' => 'succes', 'message' => 'La marca se guardo con exito']);
    }

    public function edit($id)
    {
        $brand_data = DB::table('view_brands')->select(['id', 'name', 'description'])
                        ->find($id);
        return $brand_data;
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'name' => [
                'max:255',
                Rule::unique('view_brands')->ignore($request->brand_id)->where(function ($query) {
                    return $query->where('is_active', 1);
                }),
            ],
            'description' => ['required']
        ]);

        $brand_data = Brand::findOrFail($request->brand_id);
        $brand_data->name = $request->name;
        $brand_data->description = $request->description;
        $brand_data->save();
        
        return response()->json(['status' => 'succes', 'message' => 'La marca se guardo con exito']); 
    }

    public function desactivarBySelection(Request $request)
    {
        $this->validate($request, [
            'brandIdArray' => ['required', 'array', 'min:1']
        ]);

        Brand::whereIn('id', $request['brandIdArray'])->update(['is_active' => false]);
        
        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido desactiva']); 
    }

    public function activarBySelection(Request $request)
    {
        $this->validate($request, [
            'brandIdArray' => ['required', 'array', 'min:1']
        ]);

        Brand::whereIn('id', $request['brandIdArray'])->update(['is_active' => true]);

        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido activado']); 
    }

    public function deleteBySelection(Request $request){
        $this->validate($request, [
            'brandIdArray' => ['required', 'array', 'min:1']
        ]);

        Brand::whereIn('id', $request['brandIdArray'])->update(['deleted_at' => date('Y-m-d H:i:s')]);
       
        return response()->json(['status' => 'success', 'messages' => 'Los usuario selecionado se ha eliminado con exito']);
    }

    public function desactivar($id)
    {
        $brand_data = Brand::findOrFail($id);
        $brand_data->is_active = false;
        $brand_data->save();
        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido desactiva']);
    }

    public function activar($id)
    {
        $brand_data = Brand::findOrFail($id);
        $brand_data->is_active = true;
        $brand_data->save();
        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido activado']); 
    }

    public function destroy($id){
        $brand_data = Brand::findOrFail($id);
        $brand_data->deleted_at = date('Y-m-d H:i:s');
        $brand_data->save();
        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido eliminado']); 
    }
}
