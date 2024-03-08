<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentsController extends Controller
{
    public function index(){
        return view('payments.index');
    }

    public function create() {
        return view('payments.create');
    }

    public function loadCreateComboAccounts(){
        $option_initial = ['id' => '', 'name' => trans('file.without_accounts')];

        $accounts = DB::table('view_accounts_create_pyments_list')->get();

        if ($accounts->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_account')];
        }

        $accounts->prepend((object)$option_initial);

        return $accounts;
    }
    public function loadCreateComboSuppliers(){
        $option_initial = ['id' => '', 'name' => trans('file.without_suppliers')];
        
        $suppliers = DB::table('view_suppliers_create_payments_list')->get();

        if ($suppliers->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.supplier_select_supplier')];
        }

        $suppliers->prepend((object)$option_initial);
        return $suppliers;
    }

    public function searchPurchase(Request $request)
    {
        $where = [];

        if (!empty($request->supplier_id)) {
            $where[] = ['supplier_id', '=', $request->supplier_id];
        }

        if (!empty($request->range_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where[] = [DB::raw('DATE_FORMAT(purchase_date,"%Y-%m-%d")'), '>=', trim($date_from)];
            $where[] = [DB::raw('DATE_FORMAT(purchase_date,"%Y-%m-%d")'), '<=', trim($date_to)];
        }

        $data = DB::table('view_purchases_create_payments')
                ->select(['id', 'purchase_date', 'supplier_name', 'total', 'paid_amounts'])
                ->where($where)
                ->get();
        
        return response()->json($data);
    }
}
