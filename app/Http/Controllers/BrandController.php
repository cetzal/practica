<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Brand;
use App\Enum\ModuleEnum;
use App\Models\LogModule;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Enum\MovementTypeEnum;
use App\Traits\LogModuleTrait;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class BrandController extends Controller
{
    use LogModuleTrait;
    
    public function index()
    {
        return view('brand.index');
    }

    public function list(Request $request)
    {
        $where = [];
        if (!empty($request->brand_name)) {
            $where[] = ['name', 'like', '%'.$request->brand_name.'%'];
        }

        if (!empty($request->supplier_id)) {
            $where[] = ['supplier_id', 'like', '%'.$request->supplier_id.'%'];
        }

        if (!empty($request->created_by)) {
            $where[] = ['created_by', 'like', '%'.$request->created_by.'%'];
        }


        if ($request->status != '') {
            $where[] = ['is_active', '=', $request->status];
        }

        if (!empty($request->range_date) && !empty($request->select_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where[] = [DB::raw('DATE_FORMAT('. $request->select_date.',"%Y-%m-%d")'), '>=', trim($date_from)];
            $where[] = [DB::raw('DATE_FORMAT('. $request->select_date.',"%Y-%m-%d")'), '<=', trim($date_to)];
        }
        
        $data = DB::table('view_brands')
                ->select(['id', 'name', 'description', 'is_active', 'created_by', 'supplier_name', 'created_at', 'updated_at'])
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

    public function store(Request $request)
    {
        $request->name = preg_replace('/\s+/', ' ', $request->name);
        $this->validate($request, [
            'name' => [
                'max:255',
                // Rule::unique('view_brands')->where(function ($query) {
                //     return $query->where('name', );
                // }),
                function($attribute, $value, $fail) {
                    if (empty($value)) {
                        return;
                    }

                    if (DB::table('view_brands')->where('name', $value)->count() > 0) {
                        $fail("The brand name already exists, by try another name.");
                    }
                }
            ],
            'description' => ['required']
        ]);
        
        $input = $request->except('image');
        $input['is_active'] = true;
        $input['created_by'] = JWTAuth::toUser()->id;
        $brand = Brand::create($input);

        if ($brand->getKey()) {
            $this->log(
                [], 
                Arr::except($brand->getOriginal(), ['id']),
                $brand->getKey(),
                ModuleEnum::BRANDS,
                MovementTypeEnum::CREATION
            );
        }
        return response()->json(['status' => 'succes', 'message' => 'La marca se guardo con exito']);
    }

    public function edit($id)
    {
        $brand_data = DB::table('view_brands')->select(['id', 'name', 'description', 'supplier_id'])
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
        $previous_value = $brand_data->getOriginal();
        $brand_data->name = $request->name;
        $brand_data->description = $request->description;
        $brand_data->supplier_id = $request->supplier_id;
        $brand_data->save();
       

        if ($brand_data->getChanges()) {
            $current_values = Arr::except($brand_data->getChanges(), ['id']);
            $this->log(
                Arr::only($previous_value, array_keys($current_values)), 
                $current_values,
                $brand_data->getKey(),
                ModuleEnum::BRANDS,
                MovementTypeEnum::UPDATING
            );
        }
        return response()->json(['status' => 'succes', 'message' => 'La marca se guardo con exito']); 
    }

    public function deactivateBySelection(Request $request)
    {
        $this->validate($request, [
            'brandIdArray' => ['required', 'array', 'min:1']
        ]);

        Brand::whereIn('id', $request->brandIdArray)->update(['is_active' => false]);
        
        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido desactiva']); 
    }

    public function activateBySelection(Request $request)
    {
        $this->validate($request, [
            'brandIdArray' => ['required', 'array', 'min:1']
        ]);

        Brand::whereIn('id', $request->brandIdArray)->update(['is_active' => true]);

        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido activado']); 
    }

    public function deleteBySelection(Request $request){
        $this->validate($request, [
            'brandIdArray' => ['required', 'array', 'min:1']
        ]);

        $products = DB::table('view_products')->select(['id', 'name', 'brand_id', 'brand_name'])->whereIn('brand_id', $request->brandIdArray)->get();
        $brand_ids = [];
        $brand_names = [];
        if ($products->count() > 0) {
            $brand_ids = array_values(array_unique($products->pluck('brand_id')->toArray()));
            $brand_names = array_values(array_unique($products->pluck('brand_name')->toArray()));
        }
        
        $message = 'Se borraron todas las marcas seleccionadas';
        $brand_deletes = array_diff($request->brandIdArray, $brand_ids);

        if (count($brand_ids) > 0) {
            $brand = $brand_names[0];
            if (count($brand_names) > 1) {
                $brand.=', '.$brand_names[1].'...';
            }
            $message = 'Se borraron '. count($brand_deletes) .' Marcas. No se borraron {'.$brand.'} porque cuentan con productos';
        }
        
        Brand::whereIn('id', $brand_deletes)->update(['deleted_at' => date('Y-m-d H:i:s'), 'is_active' => false]);

        return response()->json(['status' => 'success', 'messages' => $message]);
    }

    public function deactivate($id)
    {
        $brand_data = Brand::findOrFail($id);
        $previous_value = Arr::except($brand_data->getOriginal(), ['id']);
        $brand_data->is_active = false;
        $brand_data->save();

        if ($current_value = $brand_data->getChanges()) {
            $this->log(
                $previous_value,
                Arr::except($current_value, ['id']),
                $brand_data->getKey(),
                ModuleEnum::BRANDS,
                MovementTypeEnum::UPDATING
            );
        }

        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido desactiva']);
    }

    public function activate($id)
    {
        $brand_data = Brand::findOrFail($id);
        $previous_value = Arr::except($brand_data->getOriginal(), ['id']);
        $brand_data->is_active = true;
        $brand_data->save();

        if ($current_value = $brand_data->getChanges()) {
            $this->log(
                $previous_value,
                Arr::except($current_value, ['id']),
                $brand_data->getKey(),
                ModuleEnum::BRANDS,
                MovementTypeEnum::UPDATING
            );
        }
        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido activado']); 
    }

    public function destroy($id){
        $brand_data = Brand::findOrFail($id);
        $products = DB::table('view_products')->select(['id'])->where('brand_id', $brand_data->getKey())->get();
        if (count($products) > 0) {
            return response()->json(['status' => 'warning', 'message' => 'La marca no se puede eliminar, tiene uno o varios productos asignados.']); 
        }
        $brand_data->deleted_at = date('Y-m-d H:i:s');
        $brand_data->is_active = false;
        $brand_data->save();
        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido eliminado']); 
    }

    public function brandBySupplier($id){
        $data = DB::table('view_brands_active')->select(['id', 'name'])->where('supplier_id', $id)->get();
        return $data;
    }

    public function allBrandsBySupplier($id){
        $data = DB::table('view_brands_for_edit')->select(['id', 'name', 'is_active'])->where('supplier_id', $id)->get();
        return $data;
    }
}
