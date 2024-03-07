<?php

namespace App\Http\Controllers;

use App\Enum\ModuleEnum;
use App\Enum\MovementTypeEnum;
use App\Models\Accounts;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Tymon\JWTAuth\Facades\JWTAuth;

class AccountsController extends Controller
{
    public function index(){
        return view('Accounts.index');
    }

    public function list(Request $request){

        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;


        $query = DB::table('view_accounts');

        $data = $query->get();
        $totalData = $data->count();
        $totalFiltered = $totalData;
        $data = $data->skip($start)->take($limit)->values();
        
        return $this->formatResponse($request->draw, $totalData, $totalFiltered, $data);


    }

    public function show($id){
        $data = DB::table('view_accounts')->where('id',$id)->first();
        
        if(!$data){
            return response()->json(['status' => 'error', 'message' => 'La cuenta no fue encontrada',  'data' => $data]);
        }else{
            return response()->json(['status' => 'success', 'message' => 'La cuenta se encontro',  'data' => $data]);
        }
       
    }

    public function store(Request $request){
        $request->name = preg_replace('/\s+/', ' ', $request->name);
        $this->validate($request, [
            'name' => [
                'required',
                'max:255',
                Rule::unique('view_accounts'),

            ],
            'init_balance' => ['required']
        ]);
        $input = $request->all();
        if(!isset($input['is_active']))
            $input['is_active'] = false;
        
        $input['user_id'] = JWTAuth::toUser()->id;
        $brand = Accounts::create($input);

        if ($brand->getKey()) {
            $this->log(
                [], 
                Arr::except($brand->getOriginal(), ['id']),
                $brand->getKey(),
                ModuleEnum::ACCOUNTS,
                MovementTypeEnum::CREATION
            );
        }
        return response()->json(['status' => 'succes', 'message' => 'La cuenta se guardo con exito']);
    }

    public function update(Request $request, $id){
        
        $this->validate($request, [
            'name' => [
                'required',
                'max:255',
                Rule::unique('view_accounts'),

            ],
            'init_balance' => ['required']
        ]);

        $account_data = Accounts::findOrFail($id);
        $previous_value = $account_data->getOriginal();
        $account_data->name = $request->name;
        $account_data->init_balance = $request->init_balance;
        if(!isset($request->is_active))
            $account_data->is_active = false;
        else
            $account_data->is_active = true;

        $account_data->save();
        if ($account_data->getChanges()) {
            $current_values = Arr::except($account_data->getChanges(), ['id']);
            $this->log(
                Arr::only($previous_value, array_keys($current_values)), 
                $current_values,
                $account_data->getKey(),
                ModuleEnum::CLIENTS,
                MovementTypeEnum::UPDATING
            );
        }
        return response()->json(['status' => 'succes', 'message' => 'La cuenta se guardo con exito']); 
    }

    public function activate($id){
        $data_account = Accounts::find($id);
        $previous_value = Arr::except($data_account->getOriginal(), ['id']);
        $data_account->is_active = true;
        $data_account->save();

        if ($current_value = $data_account->getChanges()) {
            $this->log(
                $previous_value,
                Arr::except($current_value, ['id']),
                $data_account->getKey(),
                ModuleEnum::ACCOUNTS,
                MovementTypeEnum::UPDATING
            );
        }

        return response()->json(['status' => 'success', 'message' => 'El cliente se ha activado con exito']);
    }

    public function deactivate($id) {
        $data_account = Accounts::find($id);
        $previous_value = Arr::except($data_account->getOriginal(), ['id']);
        $data_account->is_active = false;
        $data_account->save();

        if ($current_value = $data_account->getChanges()) {
            $this->log(
                $previous_value,
                Arr::except($current_value, ['id']),
                $data_account->getKey(),
                ModuleEnum::CLIENTS,
                MovementTypeEnum::UPDATING
            );
        }

        return response()->json(['status' => 'success', 'message' => 'El cliente se ha desactivado con exito']);
    }

    public function destroy($id)
    {
        $client_data = Accounts::findOrFail($id);
        $client_data->is_active = false;
        $client_data->deleted_at = date('Y-m-d H:i:s');
        $client_data->save();
     
        return response()->json(['status' => 'success', 'message' => 'El cliente se ha eliminado con exito']);
    }
}
