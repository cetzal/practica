<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Services\JWTService;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Namshi\JOSE\JWT;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTFactory;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function ajaxLogin(Request $request){
       
       $this->validate($request, [
                'email' => [
                    'required',
                    'email',
                ],
                'password' => [
                    'password' => ['required'],
                ]
            ]);
        $email = $request->input('email');
        $pass = $request->input('password');

        $user = DB::table('view_users_login')->where('email', $email)->first();

        if($user){
            
            if (Hash::check($pass, $user->password)) {
     
                if(!$jwt_token = JWTAuth::fromUser(new JWTService($user))){
                    return response()->json(['status' => 'error', 'message' => 'usuario o contraseña no válidos', 'data' => []]);
                }

                session([
                    // 'user_confirmed' => $userInformation['user']['confirmed'],
                    // 'user_name' => $userInformation['user']['name'],
                    // 'user_email' =>  $userInformation['user']['email'],
                    // 'type_user' => $userInformation['user']['type_user'],
                    'token' => $jwt_token,
                    // 'refresh_token' => $userInformation['refresh_token']
                ]);
                $user->token = $jwt_token;
                unset($user->password);
                return response()->json([
                    'status' => 'success', 
                    'message' => 'Bienbenido', 
                    'data' => $user], 200)->withCookie(cookie('access_token', $jwt_token, 45000));

            } else {
                return response()->json(['status' => 'error', 'message' => 'usuario o contraseña no válidos', 'data' => []]);
            }
        }else{
            return response()->json(['status' => 'error', 'message' => 'usuario o contraseña no válidos', 'data' => []]);
        }
    }

    public function logout(){
        return redirect('/')->withCookie(cookie('access_token', '', -1));
    }
}
