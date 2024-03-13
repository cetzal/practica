<?php

namespace App\Http\Controllers;

use App\Models\Charge;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChargeController extends Controller
{
    public function index()
    {
        return view('charge.index');
    }
    
    public function list(Request $request)
    {
        $where = [];
        
        if (!empty($request->account_id)) {
            $where[] = ['account_id', '=', $request->account_id];
        }

        if (!empty($request->client_id)) {
            $where[] = ['clients', 'like', '%'.$request->client_id.'%'];
        }

        if (!empty($request->range_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where[] = [DB::raw('DATE_FORMAT(charge_date,"%Y-%m-%d")'), '>=', trim($date_from)];
            $where[] = [DB::raw('DATE_FORMAT(charge_date,"%Y-%m-%d")'), '<=', trim($date_to)];
        }

        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;

        $count_filtered = DB::table('view_charges')
                            ->select(['id'])
                            ->where($where)
                            ->orderBy('charge_date', 'DESC')
                            ->count();

        $data = DB::table('view_charges')
                            ->select(['id', 'account_name', 'charge_date', 'amount', 'clients'])
                            ->where($where)
                            ->skip($start)->take($limit)
                            ->orderBy('charge_date', 'DESC')
                            ->get();

        $total_data = $count_filtered;
        $total_filtered = $count_filtered;
        
        return $this->formatResponse($request->draw, $total_data, $total_filtered, $data);
    }
    
    public function create()
    {
        return view('charge.create');
    }

    public function store(Request $request)
    {
        $this->validate($request,[
            'account_id' => ['required'],
            'sales' => ['required', 'array', 'min:1'],
            'sales.*.sale_id' => ['required'],
            'sales.*.amount' => ['required']
        ]);
        $save = DB::select(
            "CALL sp_create_charge(?,?)", 
            [
                $request->account_id, 
                json_encode($request->sales)
            ]
        );
        $save = current($save);

        if (isset($save->message)) {
            return response()->json([
                'status' => 'succes',
                'message' => $save->message
            ]); 
        }

        if(isset($save->error)) {
            return response()->json([
                'errors' => [
                    'message' => [
                        'The sale could not be completed please try again, if the error persists, please contact technical support.'
                    ]
                ]
            ], 422);
            exit;
        }
    }

    public function detail(Request $request, $id)
    {
        $charge_date = Carbon::createFromFormat('Y-m-d', $request->charge_date)->format('d/m/Y');
        $charge_id = $request->id;

        return view('charge.detail', compact('charge_date', 'charge_id'));
    }

    public function detailList(Request $request, $id)
    {
        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;

        $count_filtered = DB::table('view_charges_detail')
                    ->select(['id'])
                    ->where('charge_id', $id)
                    ->count();

        $data = DB::table('view_charges_detail')
                    ->select(['account_name', 'client_name', 'amount'])
                    ->where('charge_id', $id)
                    ->skip($start)->take($limit)
                    ->get();


        $total_data = $count_filtered;
        $total_filtered = $count_filtered;
        
        return $this->formatResponse($request->draw, $total_data, $total_filtered, $data);
    }

    public function loadCreateComboAccounts()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_accounts')];

        $accounts = DB::table('view_accounts_create_list')->get();

        if ($accounts->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_account')];
        }

        $accounts->prepend((object)$option_initial);

        return $accounts;
    }

    public function loadSearchComboAccounts()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_accounts')];

        $accounts = DB::table('view_charges_accounts_index')->get();

        if ($accounts->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_account')];
        }

        $accounts->prepend((object)$option_initial);

        return $accounts;
    }

    public function loadSearchComboClients()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_clients')];

        $clients = DB::table('view_charges_clients_index')->get();

        if ($clients->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_client')];
        }

        $clients->prepend((object)$option_initial);

        return $clients;
    }

    public function loadSearchSaleComboClients()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_clients')];

        $clients = DB::table('view_sales_clients_list')->get();

        if ($clients->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_client')];
        }

        $clients->prepend((object)$option_initial);

        return $clients;
    }

    public function searchSales(Request $request)
    {
        $where = [];

        if (!empty($request->client_id)) {
            $where[] = ['client_id', '=', $request->client_id];
        }

        if (!empty($request->range_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where[] = [DB::raw('DATE_FORMAT(sale_date,"%Y-%m-%d")'), '>=', trim($date_from)];
            $where[] = [DB::raw('DATE_FORMAT(sale_date,"%Y-%m-%d")'), '<=', trim($date_to)];
        }

        $data = DB::table('view_charges_sales_search')
                ->select(['id', 'sale_date', 'client_name', 'total', 'total_charged'])
                ->where($where)
                ->whereRaw('total <> 0')
                ->get();
        
        return response()->json($data);
    }

    public function destroy($id)
    {
        $save = DB::select('CALL sp_delete_charge(?)', [$id]);
        
        $save = current($save);

        if (isset($save->message)) {
            return response()->json([
                'status' => 'succes',
                'message' => $save->message
            ]); 
        }

        if(isset($save->error)) {
            return response()->json([
                'errors' => [
                    'message' => [
                        'The sale could not be completed please try again, if the error persists, please contact technical support.'
                    ]
                ]
            ], 422);
            exit;
        }
    }
}
