<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Presupuesto;
use App\Models\GastoDetalle;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ReporteController extends Controller
{
    public function presupuestoVsEjecucion(Request $request)
    {
        // $request->validate([
        //     'fecha_inicio' => 'required|date',
        //     'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        // ]);
        $fecha_inicio = $request->fecha_inicio;
        $fecha_fin = $request->fecha_fin;
        $userId = Auth::id();
        $presupuestos = Presupuesto::select('tipo_gasto_id', DB::raw('SUM(monto) as monto_presupuesto'))
            ->whereBetween('mes', [$fecha_inicio, $fecha_fin])
            ->where('user_id', $userId)
            ->groupBy('tipo_gasto_id')
            ->get();

        $ejecucion = GastoDetalle::select('tipo_gasto_id', DB::raw('SUM(monto) as monto_ejecutado'))
            ->whereHas('gastoEncabezado', function ($query) use ($fecha_inicio, $fecha_fin, $userId) {
                $query->whereBetween('fecha', [$fecha_inicio, $fecha_fin])
                    ->where('status', 1)
                    ->where('user_id', $userId);
            })
            ->groupBy('tipo_gasto_id')
            ->get();

        $presupuestosArr = $presupuestos->keyBy('tipo_gasto_id');
        $ejecucionArr = $ejecucion->keyBy('tipo_gasto_id');

        $tipoGastoIds = $presupuestos->pluck('tipo_gasto_id')
            ->merge($ejecucion->pluck('tipo_gasto_id'))
            ->unique();

        $data = [];
        foreach ($tipoGastoIds as $tipoId) {
            $data[] = [
                'tipo_gasto_id' => $tipoId,
                'nombre' => optional(\App\Models\TipoGasto::find($tipoId))->nombre ?? 'Desconocido',
                'presupuesto' => $presupuestosArr[$tipoId]->monto_presupuesto ?? 0,
                'ejecutado' => $ejecucionArr[$tipoId]->monto_ejecutado ?? 0,
            ];
        }

        return inertia('Reportes/GraficoPresupuestoEjecucion', [
            'data' => $data,
            'fecha_inicio' => $fecha_inicio,
            'fecha_fin' => $fecha_fin,
        ]);
    }
}
