<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class PaymentsController extends Controller
{
    public function index(){
        return view('payments.index');
    }

    public function list(Request $request){

        $where = [];
        if (!empty($request->account_id)) {
            $where[] = ['account_id', '=', $request->account_id];
        }

        if (!empty($request->supplier_id)) {
            $where[] = ['supplier_id', '=', $request->supplier_id];
        }

        if (!empty($request->range_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where[] = [DB::raw('DATE_FORMAT(paid_date,"%Y-%m-%d")'), '>=', trim($date_from)];
            $where[] = [DB::raw('DATE_FORMAT(paid_date,"%Y-%m-%d")'), '<=', trim($date_to)];
        }

        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;


        $query = DB::table('view_payments')->where($where);

        $data = $query->get();
        $totalData = $data->count();
        $totalFiltered = $totalData;
        $data = $data->skip($start)->take($limit)->values();
        
        return $this->formatResponse($request->draw, $totalData, $totalFiltered, $data);
    }

    public function detail(Request $request, $id)
    {
        $paid_date = Carbon::createFromFormat('Y-m-d', $request->paid_date)->format('d/m/Y');
        $payments_id = $request->id;

        return view('payments.detail', compact('paid_date', 'payments_id'));
    }

    public function detailList(Request $request, $id)
    {
        if($request->length != -1)
            $limit = $request->length;
        else
            $limit = 10;
        $start = $request->start ?? 1;

        $count_filtered = DB::table('view_payments_detail')
                    ->select(['id'])
                    ->where('payments_id', $id)
                    ->count();

        $data = DB::table('view_payments_detail')
                    ->select(['account_name', 'supplier_name', 'purchase_date','amount'])
                    ->where('payments_id', $id)
                    ->skip($start)->take($limit)
                    ->get();


        $total_data = $count_filtered;
        $total_filtered = $count_filtered;
        
        return $this->formatResponse($request->draw, $total_data, $total_filtered, $data);
    }

    public function create() {
        return view('payments.create');
    }

    public function store(Request $request){
        $this->validate($request,[
            'account_id' => ['required'],
            'supplier_id' => ['required'],
            'payments_purchase' => ['required', 'array', 'min:1'],
            'payments_purchase.*.purchase_id' => ['required'],
            'payments_purchase.*.amount' => ['required']
        ]);
       
        $save = DB::select(
            "CALL sp_create_payments(?,?,?,?)", 
            [
                $request->account_id, 
                $request->supplier_id, 
                JWTAuth::toUser()->id, 
                json_encode($request->payments_purchase)
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
                        'The purchases could not be completed please try again, if the error persists, please contact technical support.'
                    ]
                ]
            ], 422);
            exit;
        }
    }

    public function destroy($id){

        $save = DB::select(
            "CALL sp_delete_payments(?)", 
            [
                $id
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
                        'The purchases could not be completed please try again, if the error persists, please contact technical support.'
                    ]
                ]
            ], 422);
            exit;
        }
    }

    public function loadCreateComboAccounts(){
        $option_initial = ['id' => '', 'name' => trans('file.without_accounts') , 'is_active' => 1, 'total_balance' => 0];

        $accounts = DB::table('view_accounts_create_pyments_list')->get();

        if ($accounts->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_account'), 'is_active' => 1, 'total_balance' => 0];
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

    public function loadSearchComboAccounts()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_accounts')];

        $accounts = DB::table('view_payments_accounts_list')->get();

        if ($accounts->count()) {
            $option_initial = ['id' => '', 'name' => trans('file.select_account')];
        }

        $accounts->prepend((object)$option_initial);

        return $accounts;
    }

    public function loadSearchComboSuppliers()
    {
        $option_initial = ['id' => '', 'name' => trans('file.without_suppliers')];
        $suppliers = DB::table('view_payments_suppliers_list')->get();

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
