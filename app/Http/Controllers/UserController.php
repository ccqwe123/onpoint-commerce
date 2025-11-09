<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

    public function create()
    {
         return Inertia::render('Users/Create');
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
         return Inertia::render('Users/Edit', [
            'user' => $user
         ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'position' => 'required',
            'user_type' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);
        try {
            $product = User::create([
                'name' => $validated['name'],
                'is_active' => $validated['is_active'],
                'position' => $validated['position'] ?? null,
                'email' => $validated['email'],
                'user_type' => $validated['user_type'],
                'password' => Hash::make($validated['password']),
            ]);

             return redirect()->route('users.index')->with('success', 'User created successfully.');
        } catch (\Throwable $th) {
            info($th);
        }
    }

    public function toggle(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if($user){
            $user->is_active = !$user->is_active;
            $user->save();

            return redirect()->route('users.index')->with('success', 'User status updated successfully.');
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'position' => 'required',
            'user_type' => 'required',
            'email' => 'required|email|unique:users,email,'. $id,
            'password' => 'nullable|min:6|confirmed',
        ]);
        try {
            $user = User::findOrFail($id);

            $user->name = $validated['name'];
            $user->position = $validated['position'];
            $user->email = $validated['email'];
            $user->user_type = $validated['user_type'];
            $user->is_active = $validated['is_active'];

            if (!empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }

            $user->save();

            return redirect()
                ->route('users.index')
                ->with('success', 'User updated successfully.');
        } catch (\Throwable $th) {
            report($th);
            return back()->withErrors(['error' => 'Failed to update user.']);
        }
    }
}
