<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Deposito;
use App\Models\Presupuesto;
use App\Models\GastoDetalle;
use App\Models\TipoGasto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function dashboard()
    {
        $userId = Auth::id();

        $totalPresupuesto = Presupuesto::where('user_id', $userId)->sum('monto');
        $totalEjecutado = GastoDetalle::join('gastos_encabezado', 'gastos_encabezado.id', '=', 'gastos_detalle.gasto_encabezado_id')
            ->where('gastos_encabezado.status', 1)
            ->where('gastos_encabezado.user_id', $userId)
            ->sum('gastos_detalle.monto');

        $comparativo = Presupuesto::select('tipo_gasto_id', DB::raw('SUM(monto) as presupuesto'))
            ->groupBy('tipo_gasto_id')
            ->where('user_id', $userId)
            ->get()
            ->map(function ($pres) {
                $ejecutado = GastoDetalle::join('gastos_encabezado', 'gastos_encabezado.id', '=', 'gastos_detalle.gasto_encabezado_id')
                    ->where('gastos_encabezado.status', 1)
                    ->where('gastos_detalle.tipo_gasto_id', $pres->tipo_gasto_id)
                    ->sum('gastos_detalle.monto');

                return [
                    'nombre' => TipoGasto::find($pres->tipo_gasto_id)?->nombre ?? 'N/D',
                    'presupuesto' => (float) $pres->presupuesto,
                    'ejecutado' => (float) $ejecutado,
                ];
            });

        $ultimosGastos = GastoDetalle::with('tipoGasto', 'gastoEncabezado')
            ->whereHas('gastoEncabezado', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->latest('id')
            ->take(5)
            ->get()
            ->map(fn($gasto) => [
                'fecha' => optional($gasto->gastoEncabezado)->fecha ?? 'N/A',
                'tipo' => optional($gasto->tipoGasto)->nombre ?? 'N/D',
                'monto' => (float) $gasto->monto,
            ]);


        return Inertia::render('dashboard', compact(
            'totalPresupuesto',
            'totalEjecutado',
            'comparativo',
            'ultimosGastos'
        ));
    }
}
