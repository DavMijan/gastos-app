<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Deposito;
use App\Models\FondoMonetario;
use Inertia\Inertia;

class DepositoController extends Controller
{
    public function index()
    {
        return Inertia::render('Movimientos/Depositos', [
            'fondos' => FondoMonetario::where('status', 1)->get(),
            'depositos' => Deposito::with('fondo')->orderByDesc('fecha')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date',
            'fondos_monetarios_id' => 'required|exists:fondos_monetarios,id',
            'monto' => 'required|numeric|min:0.01',
        ]);

        Deposito::create([
            'user_id' => auth()->id(),
            'fondos_monetarios_id' => $request->fondos_monetarios_id,
            'fecha' => $request->fecha,
            'monto' => $request->monto,
            'status' => 1,
        ]);

        return redirect()->route('depositos.index');
    }

    public function anular($id)
    {
        $deposito = Deposito::findOrFail($id);
        $deposito->status = 0;
        $deposito->save();

        return back();
    }
}
