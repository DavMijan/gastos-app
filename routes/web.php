<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TipoGastoController;
use App\Http\Controllers\FondoMonetarioController;
use App\Http\Controllers\PresupuestoController;
use App\Http\Controllers\GastoController;
use App\Http\Controllers\DepositoController;
use App\Http\Controllers\ConsultaMovimientosController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [HomeController::class, 'dashboard'])->name('dashboard');
});


Route::prefix('mantenimientos/tipos-gasto')
    ->middleware(['auth', 'role:admin'])
    ->group(function () {
        Route::get('/', [TipoGastoController::class, 'index'])->name('tipos-gasto.index');
        Route::get('/create', [TipoGastoController::class, 'create'])->name('tipos-gasto.create');
        Route::post('/', [TipoGastoController::class, 'store'])->name('tipos-gasto.store');
        Route::get('/{id}/edit', [TipoGastoController::class, 'edit'])->name('tipos-gasto.edit');
        Route::put('/{id}', [TipoGastoController::class, 'update'])->name('tipos-gasto.update');
        Route::put('/{id}/inactivar', [TipoGastoController::class, 'inactivar'])->name('tipos-gasto.inactivar');
    });

Route::prefix('mantenimientos/fondos-monetarios')
    ->middleware(['auth', 'role:admin'])
    ->group(function () {
        Route::get('/', [FondoMonetarioController::class, 'index'])->name('fondos-monetarios.index');
        Route::get('/create', [FondoMonetarioController::class, 'create'])->name('fondos-monetarios.create');
        Route::post('/', [FondoMonetarioController::class, 'store'])->name('fondos-monetarios.store');
        Route::get('/{id}/edit', [FondoMonetarioController::class, 'edit'])->name('fondos-monetarios.edit');
        Route::put('/{id}', [FondoMonetarioController::class, 'update'])->name('fondos-monetarios.update');
        Route::put('/{id}/inactivar', [FondoMonetarioController::class, 'inactivar'])->name('fondos-monetarios.inactivar');
    });

Route::middleware(['auth'])->prefix('movimientos/presupuestos')->group(function () {
    Route::resource('presupuestos', PresupuestoController::class)->except(['show']);
    Route::get('/', [PresupuestoController::class, 'index'])->name('presupuestos.index');
    Route::get('/create', [PresupuestoController::class, 'create'])->name('presupuestos.create');
    Route::post('/', [PresupuestoController::class, 'store'])->name('presupuestos.store');
});

Route::prefix('movimientos/gastos')
    ->middleware(['auth'])
    ->group(function () {
        Route::get('/', [GastoController::class, 'index'])->name('gastos.index');
        Route::post('/', [GastoController::class, 'store'])->name('gastos.store');
        Route::get('/{id}', [GastoController::class, 'show'])->name('gastos.show');
        Route::put('/{id}/anular', [GastoController::class, 'anular'])->name('gastos.anular');
    });


Route::prefix('movimientos/depositos')
    ->middleware(['auth'])
    ->group(function () {
        Route::get('/', [DepositoController::class, 'index'])->name('depositos.index');
        Route::post('/', [DepositoController::class, 'store'])->name('depositos.store');
        Route::delete('/{id}/anular', [DepositoController::class, 'anular'])->name('depositos.anular');
    });



Route::prefix('reportes/consulta-movimientos')
    ->middleware(['auth'])
    ->group(function () {
        Route::get('/', [ConsultaMovimientosController::class, 'index'])->name('movimientos.index');
        Route::post('/buscar', [ConsultaMovimientosController::class, 'buscar'])->name('movimientos.buscar');
    });


Route::middleware(['auth'])->group(function () {
    Route::get('/reportes/grafico-presupuesto-ejecucion', [ReporteController::class, 'presupuestoVsEjecucion'])
        ->name('reportes.grafico-presupuesto-ejecucion');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios', [UserController::class, 'store'])->name('usuarios.store');
    Route::put('/usuarios/{user}', [UserController::class, 'update'])->name('usuarios.update');
    Route::put('/usuarios/{user}/inactivar', [UserController::class, 'inactivar'])->name('usuarios.inactivar');
});




require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
