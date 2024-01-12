<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Providers\RouteServiceProvider;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

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

    public function ajaxLogin(LoginRequest $request){
        $input = $request->only('email', 'password');
        if (!$jwt_token = Auth::guard('api')->attempt($input)) {
            return response()->json(['status' => 'error', 'message' => 'usuario o contraseña no válidos', 'data' => []]);
        }
        $users = Auth::guard('api')->user();
        $users->token = $jwt_token;
        session([
            // 'user_confirmed' => $userInformation['user']['confirmed'],
            // 'user_name' => $userInformation['user']['name'],
            // 'user_email' =>  $userInformation['user']['email'],
            // 'type_user' => $userInformation['user']['type_user'],
            'token' => $jwt_token,
            // 'refresh_token' => $userInformation['refresh_token']
        ]);
        return response()->json([
            'status' => 'success', 
            'message' => 'Bienbenido', 
            'data' => $users], 200)->withCookie(cookie('access_token', $jwt_token, 45000));
    }
}
