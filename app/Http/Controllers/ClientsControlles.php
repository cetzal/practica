<?php

namespace App\Http\Controllers;

use App\Models\Clients;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
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

        if ($request->status != '') {
            $where[] = ['is_active', '=', $request->status];
        }

        if (!empty($request->range_date) && !empty($request->select_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $whereBetween = [$request->range_date, [$date_from, $date_to]];
        }

        $query = DB::table('view_clients');

        if(count($where) > 0){
            $query = $query->where($where);
        }

        if(count($whereBetween) > 0){
            $query = $query->whereBetween($whereBetween[0], $whereBetween[1]);
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
                Rule::unique('view_clients')->where(function ($query) {
                    return $query->where('is_active', 1);
                }),
            ]
        ]);

        $input = $request->all();
        $input['user_id'] = JWTAuth::toUser()->id;
        $client = Clients::create($input);
        if ($client->getKey()) {
            $this->log([], $client, 'Clients');
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
                Rule::unique('view_clients')->ignore($id)->where(function ($query) {
                    return $query->where('is_active', 1);
                }),
            ]
        ]);

        $client_data = Clients::findOrFail($id);
        $previous_value = $client_data->getOriginal();
        $client_data->name = $request->name;
        $client_data->save();
        if ($client_data->getChanges()) {
            $this->log(Arr::only($previous_value, array_keys($client_data->getChanges())), $client_data->getChanges(), 'Clients', 'Actualizacion');
        }
        return response()->json(['status' => 'succes', 'message' => 'La marca se guardo con exito']); 
    }
    
    public function activate($id){
        $data_client = Clients::find($id);
        $data_client->is_active = true;
        $data_client->save();
        return response()->json(['status' => 'success', 'message' => 'El cliente se ha activado con exito']);
    }

    public function deactivate($id) {
        $data_client = Clients::find($id);
        $data_client->is_active = false;
        $data_client->save();
        return response()->json(['status' => 'success', 'message' => 'El cliente se ha desactivado con exito']);
    }

    public function deactivateBySelection(Request $request)
    {
        $clients_id = $request->productIdArray;
        foreach ($clients_id as $id) {
            $client_data = Clients::findOrFail($id);
            $client_data->is_active = false;
            $client_data->save();
        }
       
        return response()->json(['status' => 'success', 'messages' => 'Los clientes selecionado se ha desactivado con exito']);
    }

    public function activateBySelection(Request $request)
    {
        $clients_id = $request->productIdArray;
        foreach ($clients_id as $id) {
            $client_data = Clients::findOrFail($id);
            $client_data->is_active = true;
            $client_data->save();
        }
       
        return response()->json(['status' => 'success', 'messages' => 'Los clientes selecionado se ha activado con exito']);
    }

    public function deleteBySelection(Request $request)
    {
        $clients_id = $request->productIdArray;
        foreach ($clients_id as $id) {
            $client_data = Clients::findOrFail($id);
            $client_data->is_active = false;
            $client_data->save();
            $client_data->delete();
        }
       
        return response()->json(['status' => 'success', 'messages' => 'Los clientes selecionado se ha eliminado con exito']);
    }

   
    public function destroy($id)
    {
        $client_data = Clients::findOrFail($id);
        $client_data->is_active = false;
        
        $client_data->save();
        $client_data->delete();
     
        return response()->json(['status' => 'success', 'messages' => 'El cliente se ha eliminado con exito']);
    }
}
