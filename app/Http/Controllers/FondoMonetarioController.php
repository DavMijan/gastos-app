<?php

namespace App\Http\Controllers;

use App\Models\FondoMonetario;
use Illuminate\Http\Request;

class FondoMonetarioController extends Controller
{
    public function index()
    {
        $fondos = FondoMonetario::active()->get();
        return inertia('Mantenimientos/FondosMonetarios', compact('fondos'));
    }

    public function create()
    {
        return inertia('Mantenimientos/FondosMonetariosCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|in:Cuenta Bancaria,Caja Menuda',
        ]);

        FondoMonetario::create($request->only('nombre', 'tipo'));

        return redirect()->route('fondos-monetarios.index')
            ->with('success', 'Fondo monetario creado correctamente.');
    }

    public function edit($id)
    {
        $fondo = FondoMonetario::findOrFail($id);
        return inertia('Mantenimientos/FondosMonetariosEdit', compact('fondo'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|in:Cuenta Bancaria,Caja Menuda',
        ]);

        $fondo = FondoMonetario::findOrFail($id);
        $fondo->update($request->only('nombre', 'tipo'));

        return redirect()->route('fondos-monetarios.index')
            ->with('success', 'Fondo monetario actualizado correctamente.');
    }

    public function inactivar($id)
    {
        $fondo = FondoMonetario::findOrFail($id);
        $fondo->status = 0;
        $fondo->save();

        return redirect()->route('fondos-monetarios.index')
            ->with('success', 'Fondo monetario inactivado correctamente.');
    }
}
