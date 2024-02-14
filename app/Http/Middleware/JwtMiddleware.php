<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use App\Traits\ApiResponser;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class JwtMiddleware extends BaseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try {
            $cookes = $request->header('cookie');
            
            $token_ex = explode(';', $cookes);
            $cookes_array = array();
            for ($i=0; $i < count($token_ex); $i++) { 
                if(str_contains( $token_ex[$i], 'access_token=')){
                    $cookes_array['access_token'] = str_replace('access_token=', '',$token_ex[$i]);
                }
            }
            if (!isset($cookes_array['access_token'])) {
                return redirect()->route('login')->with('error', 'Please auth!!'); 
            }

            // Auth::setToken($request->cookie('access_token'));
            // var_export($cookes_array['access_token']);
            // exit;
            JWTAuth::setToken(trim($cookes_array['access_token'])); //<-- set token and check
            if (! $claim = JWTAuth::getPayload()) {
                // return response()->json(array('message'=>'user_not_found'), 404);
                throw new Exception('User Not Found');
            }
            

            // $user = JWTAuth::parseToken()->authenticate();
            // if( !$user ) throw new Exception('User Not Found');
            
        } catch (Exception $e) {
            if($e instanceof \Tymon\JWTAuth\Exceptions\JWTException){
                //Se requiere un token - Token no proporcionado - El token no se pudo analizar de la solicitud 
                return redirect()->route('login')->with('error', 'Please auth!!'); 
                //return response()->json(['status' => 'error', 'message' => 'Se requiere un token'], 401);
            }
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                return response()->json(['status' => 'error', 'message' => 'El token es invalido'], 401);
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                return response()->json(['status' => 'error', 'message' => 'El token ha expirado'], 401);
            }else{
                if( $e->getMessage() === 'User Not Found') {
                    return response()->json(['status' => 'error', 'message' => 'El token es invalido'], 401);
                }
            }
        }  
        return $next($request);
    }
}
