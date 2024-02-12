<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\Facades\JWTAuth;

class JWTService implements JWTSubject{
    public $data_user;
    public function __construct($user){
        $this->data_user = $user;
    }

    public function getJWTIdentifier()
    {
        return $this->data_user->id;
    }
    public function getJWTCustomClaims()
    {
        return [];
    }
}