<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Users/Index', [
            'filters' => $request->only('search', 'sort_by', 'sort_direction'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'position' => 'required',
            'email' => 'required|email|unique:users,email',
        ]);

        $product = User::create([
            'name' => $validated['name'],
            'is_active' => $validated['is_active'],
            'position' => $validated['position'] ?? null,
            'email' => $validated['email'],
        ]);
    }
}
