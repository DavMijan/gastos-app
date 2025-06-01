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

        // Presupuestos por tipo de gasto en el rango
        $presupuestos = Presupuesto::select('tipo_gasto_id', DB::raw('SUM(monto) as monto_presupuesto'))
            ->whereBetween('mes', [$fecha_inicio, $fecha_fin])
            ->where('user_id', $userId)
            ->groupBy('tipo_gasto_id')
            ->get();

        // Ejecución: sumar montos de gastos detalle que estén en gastos encabezados dentro del rango
        $ejecucion = GastoDetalle::select('tipo_gasto_id', DB::raw('SUM(monto) as monto_ejecutado'))
            ->whereHas('gastoEncabezado', function ($query) use ($fecha_inicio, $fecha_fin, $userId) {
                $query->whereBetween('fecha', [$fecha_inicio, $fecha_fin])
                    ->where('status', 1) // solo activos
                    ->where('user_id', $userId);
            })
            ->groupBy('tipo_gasto_id')
            ->get();

        // Convertir a arrays para mezclar datos
        $presupuestosArr = $presupuestos->keyBy('tipo_gasto_id');
        $ejecucionArr = $ejecucion->keyBy('tipo_gasto_id');

        // Obtener lista completa de tipos de gasto involucrados
        $tipoGastoIds = $presupuestos->pluck('tipo_gasto_id')
            ->merge($ejecucion->pluck('tipo_gasto_id'))
            ->unique();

        // Construir arreglo final para la vista/gráfico
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
