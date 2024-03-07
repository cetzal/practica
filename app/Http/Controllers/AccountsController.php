<?php

namespace App\Http\Controllers;

use App\Enum\ModuleEnum;
use App\Enum\MovementTypeEnum;
use App\Models\Accounts;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Tymon\JWTAuth\Facades\JWTAuth;

class AccountsController extends Controller
{
    public function index(){
        return view('Accounts.index');
    }

    public function list(){

    }

    public function show(){

    }

    public function store(Request $request){
        $request->name = preg_replace('/\s+/', ' ', $request->name);
        $this->validate($request, [
            'name' => [
                'required',
                'max:255',
            ],
            'init_balance' => ['required']
        ]);
        $input = $request->all();
        if(!isset($input['is_active']))
            $input['is_active'] = false;
        
        $input['created_by'] = JWTAuth::toUser()->id;
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
}
