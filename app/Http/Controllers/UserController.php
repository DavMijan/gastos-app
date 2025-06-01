<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $usuarios = User::select('id', 'name', 'email', 'rol', 'status')
            ->orderBy('name')
            ->get();

        return Inertia::render('User/usuarios', compact('usuarios'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'rol' => 'required|in:usuario,admin',
        ]);

        $data['password'] = Hash::make($data['password']);

        User::create($data);

        return redirect()->route('usuarios.index');
    }

    public function update(User $user, Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'rol' => 'required|in:usuario,admin',
            'password' => 'nullable|min:6',
        ]);

        if ($data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->route('usuarios.index');
    }

    public function inactivar(User $user)
    {
        $user->update(['status' => 0]);

        return redirect()->route('usuarios.index');
    }
}
