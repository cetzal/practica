<?php

namespace App\Http\Controllers;

use Hash;
use Carbon\Carbon;
use Keygen\Keygen;
use App\Models\User;
use App\Models\Roles;
use App\Models\ViewUser;
use App\Models\LogModule;
use Illuminate\Support\Arr;
use Tymon\JWTAuth\JWTGuard;
use Illuminate\Http\Request;
use App\Traits\LogModuleTrait;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    use LogModuleTrait;

    public function index()
    {
        return view('user.index');
    }

    public function list(Request $request) {
        $where = [];

        if(!empty($request->first_name)){
            $where[] = ['name', 'like', '%'.$request->first_name.'%'];
        }
        if(!empty($request->last_name)){
            $where[] = ['last_name', 'like', '%'.$request->last_name.'%'];
        }
        if(!empty($request->email)){
            $where[] = ['email', 'like', '%'.$request->email.'%'];
        }
        if(!empty($request->user_created)){
            $where[] = ['user_parent_name', 'like', '%'.$request->user_created.'%'];
        }

        if (!empty($request->date_range) && !empty($request->select_date)) {
            list($start_date, $end_date)= explode(' - ', $request->date_range);
            $where[] = [DB::raw('DATE_FORMAT('. $request->select_date.',"%Y-%m-%d")'), '>=', Carbon::createFromFormat('d/m/Y', $start_date)->format('Y-m-d')];
            $where[] = [DB::raw('DATE_FORMAT('. $request->select_date.',"%Y-%m-%d")'), '<=', Carbon::createFromFormat('d/m/Y', $end_date)->format('Y-m-d')];
        }

        if($request->user_status != '') {
            $where[] = ['is_active', '=', $request->user_status];
        }
        
        $data = DB::table('view_users')
                    ->select([
                        'id', 'name', 'last_name',
                        'picture', 'email', 'role_name',
                        'is_active', 'user_parent_name',
                        'created_at', 'updated_at',
                    ])
                    ->where($where)
                    ->get();
        
        $totalData = $data->count();
        $totalFiltered = $totalData; 

        $json_data = array(
            "draw"            => intval($request->input('draw')),  
            "recordsTotal"    => intval($totalData),  
            "recordsFiltered" => intval($totalFiltered), 
            "data"            => $data   
        );
            
        //echo json_encode($json_data);
        return json_encode($json_data);
    }

    public function create()
    {
        return view('user.create');
    }

    public function show($id){
        $user_data = ViewUser::select([
            'id',
            'name',
            'last_name',
            'email',
            'picture',
            'role_id',
            'is_active',
        ])->findOrFail($id);
        return $user_data;
    }

    public function generatePassword()
    {
        $id = Keygen::numeric(6)->generate();
        return $id;
    }

    public function store(Request $request)
    {
        $user = JWTAuth::toUser()->id;
        $validate = $this->validate($request, [
            'name' => ['required','max:191'],
            'last_name' => ['required', 'max:191'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('view_users')
            ],
            'password' => ['required', 'max:30'],
            'is_active' => ['boolean'],
            'role_id' => ['required', 'exists:roles,id']
        ]);

        $data = $request->except('image');
        
        $message = 'User created successfully';

        if(!isset($data['is_active']))
            $data['is_active'] = false;
        $data['password'] = bcrypt($data['password']);

        $images = $request->image;
        
        $image_names = [];
        if($images) {            
            foreach ($images as $key => $image) {
                $imageName = $image->getClientOriginalName();
                $image->move('public/images/user', $imageName);
                $image_names[] = $imageName;
            }
            $data['picture'] = implode(",", $image_names);
        }
        else {
            $data['picture'] = ',zummXD2dvAtI.png';
        }
        $data['user_parent_id'] = JWTAuth::toUser()->id;
        $user = User::create($data);

        if ($user->getKey()) {
            LogModule::create($this->logFormat(
                [
                    'previous' => [],
                    'current' => $user->getOriginal(),
                    'module' => 'Usuarios',
                    'movement_type' => 'Creacion'
                ]
            ));
        }

        return response()->json(['status' => 'success', 'message' => 'El usuario fue creado con exito']);
    }

    public function edit($id)
    {
        return view('user.edit', compact('lims_user_data', 'lims_role_list', 'lims_biller_list', 'lims_warehouse_list'));
    }

    public function activarBySelection(Request $request)
    {
        $this->validate($request, [
            'userIdArray' => ['required', 'array', 'min:1']
        ]);

        User::whereIn('id', $request->userIdArray)->update(['is_active' => true]);
       
        return response()->json(['status' => 'success', 'message' => 'Los usuario selecionado se ha activado con exito']);
    }
    public function desactivarBySelection(Request $request)
    {    
        $this->validate($request, [
            'userIdArray' => ['required', 'array', 'min:1']
        ]);

        User::whereIn('id', $request->userIdArray)->update(['is_active' => false]);
       
        return response()->json(['status' => 'success', 'message' => 'Los usuario selecionado se ha desactivado con exito']);
    }
    public function deleteBySelection(Request $request){
        $this->validate($request, [
            'userIdArray' => ['required', 'array', 'min:1']
        ]);

        User::destroy($request->userIdArray);
       
        return response()->json(['status' => 'success', 'message' => 'Los usuario selecionado se ha eliminado con exito']);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'name' => ['required','max:191'],
            'last_name' => ['required', 'max:191'],
            'email' => [
                'email',
                'max:255',
                    Rule::unique('users')->ignore($id)->where(function ($query) use($id) {
                    return $query->where('is_active', false);
                }),
            ],
            'password' => ['sometimes', 'max:30'],
            'is_active' => ['boolean'],
            'role_id' => ['required', 'exists:roles,id']
        ]);

        $input = $request->except('password', '_method', '_token', 'image');
        
        if(!isset($input['is_active']))
            $input['is_active'] = false;
        if(!empty($request['password']))
            $input['password'] = bcrypt($request['password']);
        
        $user_data = User::findOrFail($id);
        $previous_value = $user_data->getOriginal();
        $images = $request->image;
        
        $image_names = [];
        if($images) {            
            foreach ($images as $key => $image) {
                $imageName = $image->getClientOriginalName();
                $image->move('public/images/user', $imageName);
                $image_names[] = $imageName;
            }
            if($user_data->picture != 'zummXD2dvAtI.png') {
                $input['picture'] = $user_data->picture.','.implode(",", $image_names);
            }
            else{
                $input['picture'] = implode(",", $image_names);
            }
        }
        else {
            $input['picture'] = $user_data->picture;
        }
        
        $user_data->update($input);

        if ($user_data->getChanges()) {
            LogModule::create($this->logFormat(
                [
                    'previous' => Arr::only($previous_value, array_keys($user_data->getOriginal())),
                    'current' => $user_data->getOriginal(),
                    'module' => 'Usuarios',
                    'movement_type' => 'Actualizacion'
                ]
            ));
        }

        return response()->json(['status' => 'success', 'message' => 'El usuario se ha actualizado con exito']);
        // return redirect('user')->with('message2', 'Data updated successfullly');
    }

    public function activar($id){
        $data_user = User::find($id);
        $data_user->is_active = true;
        $data_user->save();
        return response()->json(['status' => 'success', 'message' => 'El usuario se ha activado con exito']);
    }

    public function desactivar($id) {
        $data_user = User::find($id);
        $data_user->is_active = false;
        $data_user->save();
        return response()->json(['status' => 'success', 'message' => 'El usuario se ha desactivado con exito']);
    }

    public function delete($id){
        $user_data =User::find($id);
        $user_data->is_active = false;
        $user_data->save();
        $user_data->delete();
        return response()->json(['status' => 'success', 'message' => 'El usuario se ha eliminado con exito']);
    }
}
