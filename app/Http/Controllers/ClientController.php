<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    public function search(Request $request)
    {
        $term = $request->input('name', '');

        return Client::where('name', 'like', "%{$term}%")
            ->limit(10)
            ->get(['id', 'name']);
    }
}
