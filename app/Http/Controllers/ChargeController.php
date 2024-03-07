<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChargeController extends Controller
{
    public function index()
    {
        return view('charge.index');
    }
    
    public function list(Request $request)
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

        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;

        // $totalData = $data->count();
        // $totalFiltered = $totalData;
        // $data = $data->skip($start)->take($limit)->values();
        $totalData = 0;
        $totalFiltered = $totalData;
        $data = [];
        
        return $this->formatResponse($request->draw, $totalData, $totalFiltered, $data);
    }
    
    public function create()
    {
        return view('charge.create');
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

    public function loadSearchComboClients()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_clients')];

        // $clients = DB::table('view_sales_clients_list')->get();

        // if ($clients->count()) {
        //     $option_initial = ['id' => '', 'name' => trans('file.select_client')];
        // }

        // $clients->prepend((object)$option_initial);

        // return $clients;
        return [$option_initial];
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

        $data = DB::table('view_sales')
                ->select(['id', 'sale_date', 'client_name', 'total'])
                ->where($where)
                ->get();
        
        return response()->json($data);
    }
}
