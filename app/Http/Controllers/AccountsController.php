<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Enum\ModuleEnum;
use App\Models\Accounts;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Enum\MovementTypeEnum;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class AccountsController extends Controller
{
    public function index(){
        return view('Accounts.index');
    }

    public function list(Request $request)
    {
        $where = [];

        if (!empty($request->account_name)) {
            $where[] = ['name', 'like', '%'.$request->account_name.'%'];
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

        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;


        $query = DB::table('view_accounts')->where($where);

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

    public function update(Request $request, $id) {
        $this->validate($request, [
            'name' => [
                'required',
                'max:255',
                Rule::unique('view_accounts')->ignore($id)->where(function ($query) {
                    return $query->whereRaw('deleted_at IS NULL');
                }),
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
        $account_data = Accounts::findOrFail($id);

        $charges = DB::table('view_charges')
                    ->select('id')
                    ->where('account_id', $account_data->getKey())
                    ->count();
        if ($charges > 0) {
            return response()->json([
                'status' => 'warning',
                'message' => 'La cuenta no se puede eliminar, tiene una o varias cobros relacionados a esta cuenta.'
            ]);
        } 
        // $payments = DB::table('view_charges')
        //             ->select('id')
        //             ->where('account_id', $account_data->getKey())
        //             ->count();

        $account_data->is_active = false;
        $account_data->deleted_at = date('Y-m-d H:i:s');
        $account_data->save();
     
        return response()->json(['status' => 'success', 'message' => 'La cuenta se ha sido eliminado']);
    }

    public function deactivateBySelection(Request $request)
    {
        $this->validate($request, [
            'accountIdArray' => ['required', 'array', 'min:1']
        ]);

        Accounts::whereIn('id', $request->accountIdArray)->update(['is_active' => false]);
        
        return response()->json(['status' => 'succes', 'message' => 'Las cuentas hab sido desactivadas']); 
    }

    public function activateBySelection(Request $request)
    {
        $this->validate($request, [
            'accountIdArray' => ['required', 'array', 'min:1']
        ]);

        Accounts::whereIn('id', $request->accountIdArray)->update(['is_active' => true]);

        return response()->json(['status' => 'succes', 'message' => 'Las cuentas han sido activadas']); 
    }

    public function deleteBySelection(Request $request){
        $this->validate($request, [
            'accountIdArray' => ['required', 'array', 'min:1']
        ]);

        $charges = DB::table('view_charges')
                    ->select(['account_id', 'account_name'])
                    ->whereIn('account_id', $request->accountIdArray)
                    ->get();
        $account_ids = [];
        $account_names = [];
        if ($charges->count() > 0) {
            $account_ids = array_values(array_unique($charges->pluck('account_id')->toArray()));
            $account_names = array_values(array_unique($charges->pluck('account_name')->toArray()));
        }
        
        $message = 'Se borraron todas las cuentas seleccionadas';
        $acount_deletes = array_diff($request->accountIdArray, $account_ids);

        if (count($account_ids) > 0) {
            if ($account_names > 1) {
                $account_names = array_slice($account_names, 0, 1);
            }
            $account_names = array_map(function($item) {
                $item = '<b>'. $item .'</b>';
                return $item;
            }, $account_names);
            
            $message = 'Se borraron '. count($acount_deletes) .' cuentas. No se borraron '.  implode(',', $account_names).' porque estas estan realaciondos con cobros';
        }
        
        Accounts::whereIn('id', $acount_deletes)->update(['deleted_at' => date('Y-m-d H:i:s'), 'is_active' => false]);

        return response()->json(['status' => 'success', 'messages' => $message]);
    }
}
