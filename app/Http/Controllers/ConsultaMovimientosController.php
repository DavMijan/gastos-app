<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GastoEncabezado;
use App\Models\Deposito;
use Illuminate\Support\Facades\Auth;

class ConsultaMovimientosController extends Controller
{
    public function index()
    {
        return inertia('Reportes/ConsultaMovimientos', [
            'movimientos' => [],
            'filtros' => [
                'desde' => now()->format('Y-m-01'),
                'hasta' => now()->format('Y-m-d'),
            ],
        ]);
    }

    public function buscar(Request $request)
    {
        $request->validate([
            'desde' => 'required|date',
            'hasta' => 'required|date|after_or_equal:desde',
        ]);

        $desde = $request->desde;
        $hasta = $request->hasta;
        $userId = Auth::id();

        $gastos = GastoEncabezado::with('fondoMonetario')
            ->whereBetween('fecha', [$desde, $hasta])
            ->where('user_id', $userId)
            ->where('status', 1)
            ->get()
            ->map(function ($gasto) {
                return [
                    'id' => $gasto->id,
                    'fecha' => $gasto->fecha,
                    'tipo' => 'Gasto',
                    'descripcion' => $gasto->nombre_comercio . ' (' . $gasto->tipo_documento . ')',
                    'fondo' => $gasto->fondoMonetario->nombre,
                    'monto' => $gasto->detalles->sum('monto'),
                    'status' => $gasto->status,
                ];
            });

        $depositos = Deposito::with('fondo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->where('user_id', $userId)
            ->where('status', 1)
            ->get()
            ->map(function ($dep) {
                return [
                    'id' => $dep->id,
                    'fecha' => $dep->fecha,
                    'tipo' => 'Depósito',
                    'descripcion' => 'Depósito registrado',
                    'fondo' => $dep->fondo->nombre,
                    'monto' => $dep->monto,
                    'status' => $dep->status,
                ];
            });

        $movimientos = $gastos->merge($depositos)->sortByDesc('fecha')->values();

        return inertia('Reportes/ConsultaMovimientos', [
            'movimientos' => $movimientos,
            'filtros' => [
                'desde' => $desde,
                'hasta' => $hasta,
            ],
        ]);
    }
}
