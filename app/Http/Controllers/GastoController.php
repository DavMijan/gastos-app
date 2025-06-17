<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\GastoEncabezado;
use App\Models\GastoDetalle;
use App\Models\Presupuesto;
use App\Models\FondoMonetario;
use App\Models\TipoGasto;
use Carbon\Carbon;
use Inertia\Inertia;

class GastoController extends Controller
{
    public function index()
    {
        $fondos = FondoMonetario::where('status', 1)->get(['id', 'nombre']);
        $tiposGasto = TipoGasto::where('status', 1)->get(['id', 'nombre']);
        $gastos = GastoEncabezado::with(['detalles.tipoGasto'])
            ->orderBy('fecha', 'desc')
            ->get();

        return Inertia::render('Movimientos/Gastos', [
            'fondos' => $fondos,
            'tiposGasto' => $tiposGasto,
            'gastos' => $gastos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date',
            'fondos_monetarios_id' => 'required|exists:fondos_monetarios,id',
            'observaciones' => 'nullable|string',
            'nombre_comercio' => 'required|string',
            'tipo_documento' => 'required|in:Factura,Comprobante,Otro',
            'detalles' => 'required|array|min:1',
            'detalles.*.tipo_gasto_id' => 'required|exists:tipos_gasto,id',
            'detalles.*.monto' => 'required|numeric|min:0.01',
        ]);

        $usuarioId = Auth::id();
        $fecha = Carbon::parse($request->fecha);
        $mes = $fecha->format('Y-m-01');

        $sobregiros = [];

        foreach ($request->detalles as $detalle) {
            $presupuesto = Presupuesto::where('user_id', $usuarioId)
                ->where('tipo_gasto_id', $detalle['tipo_gasto_id'])
                ->where('mes', $mes)
                ->first();

            $gastosActuales = GastoDetalle::whereHas('encabezado', function ($q) use ($usuarioId, $mes) {
                $q->where('user_id', $usuarioId)->whereMonth('fecha', Carbon::parse($mes)->month)->whereYear('fecha', Carbon::parse($mes)->year);
            })
                ->where('tipo_gasto_id', $detalle['tipo_gasto_id'])
                ->sum('monto');

            $totalPropuesto = $gastosActuales + $detalle['monto'];

            if ($presupuesto && $totalPropuesto > $presupuesto->monto) {
                $sobregiros[] = [
                    'tipo_gasto_id' => $detalle['tipo_gasto_id'],
                    'presupuestado' => $presupuesto->monto,
                    'sobregiro' => $totalPropuesto - $presupuesto->monto,
                ];
            }
        }

        if (count($sobregiros) > 0) {
            return back()->withErrors([
                'presupuesto' => 'Se ha sobregirado el presupuesto en uno o más tipos de gasto.',
                'detalles' => $sobregiros,
            ]);
        }
        DB::beginTransaction();

        try {
            $encabezado = GastoEncabezado::create([
                'user_id' => $usuarioId,
                'fecha' => $request->fecha,
                'fondos_monetarios_id' => $request->fondos_monetarios_id,
                'observaciones' => $request->observaciones,
                'nombre_comercio' => $request->nombre_comercio,
                'tipo_documento' => $request->tipo_documento,
            ]);

            foreach ($request->detalles as $detalle) {
                GastoDetalle::create([
                    'gasto_encabezado_id' => $encabezado->id,
                    'tipo_gasto_id' => $detalle['tipo_gasto_id'],
                    'monto' => $detalle['monto'],
                ]);
            }

            DB::commit();
            return redirect()->route('gastos.index')->with('success', 'Gasto registrado correctamente.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al registrar el gasto. Intente nuevamente.']);
        }
    }

    public function anular($id)
    {
        DB::transaction(function () use ($id) {
            $gasto = GastoEncabezado::with('detalles')->findOrFail($id);

            $gasto->status = 0;
            $gasto->save();

            foreach ($gasto->detalles as $detalle) {
                $detalle->status = 0;
                $detalle->save();
            }
        });

        return back()->with('success', 'Gasto anulado correctamente.');
    }

    public function show($id)
    {
        $gasto = GastoEncabezado::with([
            'user',
            'fondoMonetario',
            'detalles.tipoGasto'
        ])->findOrFail($id);

        return Inertia::render('Movimientos/ShowGasto', [
            'gasto' => $gasto,
        ]);
    }
}
