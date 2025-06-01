<?php

namespace App\Http\Controllers;

use App\Models\Presupuesto;
use App\Models\TipoGasto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PresupuestoController extends Controller
{
    public function index()
    {
        $presupuestos = Presupuesto::with('tipoGasto')
            ->where('user_id', Auth::id())
            ->get();

        $tipos = TipoGasto::where('status', 1)->get();

        return Inertia::render('Movimientos/Presupuestos', [
            'presupuestos' => $presupuestos,
            'tipos' => $tipos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipo_gasto_id' => 'required|exists:tipos_gasto,id',
            'anio' => 'required|digits:4',
            'mes' => 'required|digits:2',
            'monto' => 'required|numeric|min:0',
        ]);

        // Armar fecha completa
        $fechaMes = "{$request->anio}-{$request->mes}-01";

        $existe = Presupuesto::where('user_id', Auth::id())
            ->where('tipo_gasto_id', $request->tipo_gasto_id)
            ->where('mes', $fechaMes)
            ->exists();

        if ($existe) {
            return back()->withErrors(['mes' => 'Ya existe un presupuesto para ese mes y tipo de gasto.']);
        }

        Presupuesto::create([
            'user_id' => Auth::id(),
            'tipo_gasto_id' => $request->tipo_gasto_id,
            'mes' => $fechaMes,
            'monto' => $request->monto,
        ]);

        return redirect()->route('presupuestos.index');
    }

    public function update(Request $request, Presupuesto $presupuesto)
    {
        $request->validate([
            'tipo_gasto_id' => 'required|exists:tipos_gasto,id',
            'anio' => 'required|digits:4',
            'mes' => 'required|digits:2',
            'monto' => 'required|numeric|min:0',
        ]);

        $fechaMes = "{$request->anio}-{$request->mes}-01";

        $existe = Presupuesto::where('user_id', Auth::id())
            ->where('tipo_gasto_id', $request->tipo_gasto_id)
            ->where('mes', $fechaMes)
            ->where('id', '!=', $presupuesto->id)
            ->exists();

        if ($existe) {
            return back()->withErrors(['mes' => 'Ya existe un presupuesto para ese mes y tipo de gasto.']);
        }

        $presupuesto->update([
            'tipo_gasto_id' => $request->tipo_gasto_id,
            'mes' => $fechaMes,
            'monto' => $request->monto,
        ]);

        return redirect()->route('presupuestos.index');
    }

    public function destroy(Presupuesto $presupuesto)
    {
        $presupuesto->update([
            'status' => 'I', // o false, dependiendo cómo manejes estado
        ]);

        return redirect()->route('presupuestos.index');
    }
}
