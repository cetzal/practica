<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Tymon\JWTAuth\Facades\JWTAuth;

class PurchaseController extends Controller
{
    public function index()
    {
        return view('purchases.index');
    }
}
