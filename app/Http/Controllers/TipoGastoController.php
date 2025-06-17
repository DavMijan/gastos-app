<?php

namespace App\Http\Controllers;

use App\Models\TipoGasto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TipoGastoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tipos = TipoGasto::where('status', 1)->get();
        return Inertia::render('Mantenimientos/TiposGasto', [
            'tipos' => $tipos
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $last = TipoGasto::orderBy('id', 'desc')->first();

        $nextNumber = 1;
        if ($last && preg_match('/TG(\d+)/', $last->codigo, $matches)) {
            $nextNumber = (int)$matches[1] + 1;
        }

        $codigo = 'TG' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        TipoGasto::create([
            'codigo' => $codigo,
            'nombre' => $request->nombre,
            'status' => 1,
        ]);

        return redirect()->route('tipos-gasto.index')->with('success', 'Tipo de Gasto creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TipoGasto $tipoGasto)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TipoGasto $tipoGasto)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $tipo = TipoGasto::findOrFail($id);
        $tipo->nombre = $request->nombre;
        $tipo->save();

        return redirect()->route('tipos-gasto.index')
            ->with('success', 'Tipo de gasto actualizado correctamente.');
    }

    public function inactivar($id)
    {
        $tipo = TipoGasto::findOrFail($id);

        $tipo->status = 0;
        $tipo->save();

        return redirect()->route('tipos-gasto.index')
            ->with('success', 'Tipo de gasto inactivado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TipoGasto $tipoGasto)
    {
        //
    }
}
