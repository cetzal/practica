<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Enum\ModuleEnum;
use App\Models\LogModule;
use App\Models\Suppliers;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Enum\MovementTypeEnum;
use App\Traits\LogModuleTrait;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class SuppliersControlles extends Controller
{
    use LogModuleTrait;

    public function index(){
        return view('suppliers.index');
    }

    public function list(Request $request){
        $where = [];
        $whereBetween = [];
        if(!empty($request->supplier_name)){
            $where[] = ['name', 'like', '%'.$request->supplier_name.'%'];
        }

        if(!empty($request->created_by)){
            $where[] = ['created_by', 'like', '%'.$request->created_by.'%'];
        }

        if ($request->status != '') {
            $where[] = ['is_active', '=', $request->status];
        }

        if (!empty($request->range_date) && !empty($request->select_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $whereBetween = [DB::raw('DATE_FORMAT('. $request->select_date.',"%Y-%m-%d")'), [$date_from, $date_to]];
        }

        $query = DB::table('view_suppliers')->where($where);

        if(count($whereBetween) > 0){
            $query->whereBetween($whereBetween[0], $whereBetween[1]);
        }

        $data = $query->get();

        $json_data = array(
            "draw"            => intval($request->input('draw')),  
            "recordsTotal"    => intval($data->count()),  
            "recordsFiltered" => intval($data->count()), 
            "data"            => $data
        );

        return response()->json($json_data);

    }

    public function store(Request $request){
       
        $this->validate($request, [
            'name' => [
                'required',
                'max:255',
                Rule::unique('view_suppliers'),
            ]
        ]);

        $input = $request->all();
        $input['user_id'] = JWTAuth::toUser()->id;
        if(!isset($input['is_active']))
            $input['is_active'] = false;
        
        $suppliers = Suppliers::create($input);
        if(isset($input['brands_id']))
            $suppliers->brands()->attach($input['brands_id']);
        
        if ($suppliers->getKey()) {
            $this->log(
                [], 
                Arr::except($suppliers->getOriginal(), ['id']),
                $suppliers->getKey(),
                ModuleEnum::SUPPLIERS,
                MovementTypeEnum::CREATION
            );
        }
        return response()->json(['status' => 'succes', 'message' => 'El proveedor se guardo con exito']);
    }

    public function edit($id){
        $data = DB::table('view_suppliers')->where('id',$id)->first();
        
        if(!$data){
            return response()->json(['status' => 'error', 'message' => 'El proveedor no fue encontrada',  'data' => $data]);
        }else{
            return response()->json(['status' => 'success', 'message' => 'El proveedor se encontro',  'data' => $data]);
        }
    }

    public function update(Request $request, $id){
        $this->validate($request, [
            'name' => [
                'max:255',
                Rule::unique('view_suppliers')->ignore($id),
            ]
        ]);

        $supplier_data = Suppliers::findOrFail($id);

        $previous_value = $supplier_data->getOriginal();
        $supplier_data->name = $request->name;
        if(!isset($request->is_active))
            $supplier_data->is_active= false;
        else
            $supplier_data->is_active= true;
        
        $supplier_data->save();
        if(!empty($request->brands_id))
            $supplier_data->brands()->detach();
            $supplier_data->brands()->attach($request->brands_id);

        
        if ($supplier_data->getChanges()) {
            $current_values = Arr::except($supplier_data->getChanges(), ['id']);
            $this->log(
                Arr::only($previous_value, array_keys($current_values)), 
                $current_values,
                $supplier_data->getKey(),
                ModuleEnum::SUPPLIERS,
                MovementTypeEnum::UPDATING
            );
        }

        return response()->json(['status' => 'succes', 'message' => 'La proveedor se guardo con exito']); 
    }

    public function activate($id){
        $supplier_data = Suppliers::find($id);
        $previous_value = Arr::except($supplier_data->getOriginal(), ['id']);
        $supplier_data->is_active = true;
        $supplier_data->save();

        if ($current_value = $supplier_data->getChanges()) {
            $this->log(
                $previous_value,
                Arr::except($current_value, ['id']),
                $supplier_data->getKey(),
                ModuleEnum::SUPPLIERS,
                MovementTypeEnum::UPDATING
            );
        }
        return response()->json(['status' => 'success', 'message' => 'El proveeedor se ha activado con exito']);
    }

    public function deactivate($id) {
        $supplier_data = Suppliers::find($id);
        $previous_value = Arr::except($supplier_data->getOriginal(), ['id']);
        $supplier_data->is_active = false;
        $supplier_data->save();

        if ($current_value = $supplier_data->getChanges()) {
            $this->log(
                $previous_value,
                Arr::except($current_value, ['id']),
                $supplier_data->getKey(),
                ModuleEnum::SUPPLIERS,
                MovementTypeEnum::UPDATING
            );
        }

        return response()->json(['status' => 'success', 'message' => 'El proveedor se ha desactivado con exito']);
    }

    public function deactivateBySelection(Request $request)
    {
        $suppliers_id = $request->supplierIdArray;
        foreach ($suppliers_id as $id) {
            $supplier_data = Suppliers::findOrFail($id);
            $supplier_data->is_active = false;
            $supplier_data->save();
        }
       
        return response()->json(['status' => 'success', 'message' => 'Los proveedores selecionado se ha desactivado con exito']);
    }

    public function activateBySelection(Request $request)
    {   
        $suppliers_id = $request->supplierIdArray;
        foreach ($suppliers_id as $id) {
            $supplier_data = Suppliers::findOrFail($id);
            $supplier_data->is_active = true;
            $supplier_data->save();
        }
       
        return response()->json(['status' => 'success', 'message' => 'Los proveedores selecionado se ha activado con exito']);
    }

    public function deleteBySelection(Request $request)
    {
        
        $this->validate($request, [
            'supplierIdArray' => ['required', 'array', 'min:1']
        ]);

        $brands = DB::table('view_brands')->select(['id', 'name', 'supplier_id', 'supplier_name'])->whereIn('supplier_id', $request->supplierIdArray)->get();
        $supplier_ids = [];
        $supplier_names = [];
        if ($brands->count() > 0) {
            $supplier_ids = array_values(array_unique($brands->pluck('supplier_id')->toArray()));
            $supplier_names = array_values(array_unique($brands->pluck('supplier_name')->toArray()));
        }
        
        $message = 'Se borraron todas los proveedores seleccionadas';
        $supplier_deletes = array_diff($request->supplierIdArray, $supplier_ids);

        if (count($supplier_ids) > 0) {
            $supplier = $supplier_names[0];
            if (count($supplier_names) > 1) {
                $supplier.=', '.$supplier_names[1].'...';
            }
            $message = 'Se borraron '. count($supplier_deletes) .' Proveedores. No se borraron {'.$supplier.'} porque cuentan con marcas asignados';
        }
        
        Suppliers::whereIn('id', $supplier_deletes)->update(['deleted_at' => date('Y-m-d H:i:s')]);

        return response()->json(['status' => 'success', 'message' => $message]);
    
    }

   
    public function destroy($id)
    {
        $supplier_data = Suppliers::findOrFail($id);
        $brands = DB::table('view_brands')->select(['id'])->where('supplier_id', $supplier_data->getKey())->get();
        if (count($brands) > 0) {
            return response()->json(['status' => 'warning', 'message' => 'El proveedor no se puede eliminar, tiene uno o varias marcas asignados.']); 
        }
        $supplier_data->deleted_at = date('Y-m-d H:i:s');
        $supplier_data->save();
        return response()->json(['status' => 'succes', 'message' => 'El proveedor ha sido eliminado']); 
    
    }

    public function combobox(){
        $data = DB::table('view_suppliers_active')->get();
        return $data;
    }

    public function combobox_filters(){
        $data = DB::table('view_products_suppliers_edit')->select(['id', 'name', 'is_active'])->get();
        return $data;
    }

}
