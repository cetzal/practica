<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Clients;
use App\Enum\ModuleEnum;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Enum\MovementTypeEnum;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class ClientsControlles extends Controller
{
    public function index(){
        return view('clients.index');
    }

    public function list(Request $request){
        $where = [];
        $whereBetween = [];
        if(!empty($request->client_name)){
            $where[] = ['name', 'like', '%'.$request->client_name.'%'];
        }

        if(!empty($request->created_by)){
            $where[] = ['created_by', 'like', '%'.$request->created_by.'%'];
        }

        if ($request->client_status != '') {
            $where[] = ['is_active', '=', $request->client_status];
        }

        if (!empty($request->date_range) && !empty($request->select_date)) {
            list($date_from, $date_to) = explode(' - ', $request->date_range);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $whereBetween = [DB::raw('DATE_FORMAT('. $request->select_date.',"%Y-%m-%d")'), [$date_from, $date_to]];
        }
        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;

        $query = DB::table('view_clients');

        if(count($whereBetween) > 0){
            $query = $query->whereBetween($whereBetween[0], $whereBetween[1]);
        }

        $data = $query->where($where)->get();

        $json_data = array(
            "draw"            => intval($request->input('draw')),  
            "recordsTotal"    => intval($data->count()),  
            "recordsFiltered" => intval($data->count()), 
            "data"            => $data->skip($start)->take($limit)->values()
        );

        return response()->json($json_data);
    }
    
    public function store(Request $request){

        $this->validate($request, [
            'name' => [
                'required',
                'max:255',
                Rule::unique('view_clients'),
            ]
        ]);

        $input = $request->all();
        if(!isset($input['is_active']))
            $input['is_active'] = false;
        $input['user_id'] = JWTAuth::toUser()->id;
        $client = Clients::create($input);
        if ($client->getKey()) {
            $this->log(
                [], 
                Arr::except($client->getOriginal(), ['id']),
                $client->getKey(),
                ModuleEnum::CLIENTS,
                MovementTypeEnum::CREATION
            );
        }
        return response()->json(['status' => 'succes', 'message' => 'El cliente se guardo con exito']);

    }
    
    public function show($id){
        $data = DB::table('view_clients')->where('id',$id)->first();
        
        if(!$data){
            return response()->json(['status' => 'error', 'message' => 'El cliente no fue encontrada',  'data' => $data]);
        }else{
            return response()->json(['status' => 'success', 'message' => 'El clientes se encontro',  'data' => $data]);
        }
       
    }
    
    public function update(Request $request, $id){
        
        $this->validate($request, [
            'name' => [
                'max:255',
                function($attribute, $value, $fail) use($id) {
                    if (empty($value)) {
                        return;
                    }
                    
                    if (DB::table('view_clients')->where('name', $value)->where('id', '<>', $id)->count() > 0) {
                        $fail("The brand name already exists, by try another name.");
                    }
                }
            ]
        ]);

        $client_data = Clients::findOrFail($id);
        $previous_value = $client_data->getOriginal();
        $client_data->name = $request->name;
        if(!isset($request->is_active))
            $client_data->is_active = false;
        else
            $client_data->is_active = true;

        $client_data->save();
        if ($client_data->getChanges()) {
            $current_values = Arr::except($client_data->getChanges(), ['id']);
            $this->log(
                Arr::only($previous_value, array_keys($current_values)), 
                $current_values,
                $client_data->getKey(),
                ModuleEnum::CLIENTS,
                MovementTypeEnum::UPDATING
            );
        }
        return response()->json(['status' => 'succes', 'message' => 'El cliente se guardo con exito']); 
    }
    
    public function activate($id){
        $data_client = Clients::find($id);
        $previous_value = Arr::except($data_client->getOriginal(), ['id']);
        $data_client->is_active = true;
        $data_client->save();

        if ($current_value = $data_client->getChanges()) {
            $this->log(
                $previous_value,
                Arr::except($current_value, ['id']),
                $data_client->getKey(),
                ModuleEnum::CLIENTS,
                MovementTypeEnum::UPDATING
            );
        }

        return response()->json(['status' => 'success', 'message' => 'El cliente se ha activado con exito']);
    }

    public function deactivate($id) {
        $data_client = Clients::find($id);
        $previous_value = Arr::except($data_client->getOriginal(), ['id']);
        $data_client->is_active = false;
        $data_client->save();

        if ($current_value = $data_client->getChanges()) {
            $this->log(
                $previous_value,
                Arr::except($current_value, ['id']),
                $data_client->getKey(),
                ModuleEnum::CLIENTS,
                MovementTypeEnum::UPDATING
            );
        }

        return response()->json(['status' => 'success', 'message' => 'El cliente se ha desactivado con exito']);
    }

    public function deactivateBySelection(Request $request)
    {
        $clients_id = $request->clientsIdArray;
        foreach ($clients_id as $id) {
            $client_data = Clients::findOrFail($id);
            $client_data->is_active = false;
            $client_data->save();
        }
       
        return response()->json(['status' => 'success', 'message' => 'Los clientes selecionado se ha desactivado con exito']);
    }

    public function activateBySelection(Request $request)
    {
        $clients_id = $request->clientsIdArray;
        foreach ($clients_id as $id) {
            $client_data = Clients::findOrFail($id);
            $client_data->is_active = true;
            $client_data->save();
        }
       
        return response()->json(['status' => 'success', 'message' => 'Los clientes selecionado se ha activado con exito']);
    }

    public function deleteBySelection(Request $request)
    {
        $clients_id = $request->clientsIdArray;
        $delete_date = date('Y-m-d H:i:s');
        foreach ($clients_id as $id) {
            $client_data = Clients::findOrFail($id);
            $client_data->is_active = false;
            $client_data->deleted_at = $delete_date;
            $client_data->save();
        }
       
        return response()->json(['status' => 'success', 'message' => 'Los clientes selecionado se ha eliminado con exito']);
    }

   
    public function destroy($id)
    {
        $client_data = Clients::findOrFail($id);
        $client_data->is_active = false;
        $client_data->deleted_at = date('Y-m-d H:i:s');
        $client_data->save();
     
        return response()->json(['status' => 'success', 'message' => 'El cliente se ha eliminado con exito']);
    }
}
