<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GastoEncabezado extends Model
{

    protected $table = 'gastos_encabezado';

    protected $fillable = [
        'user_id',
        'fecha',
        'fondos_monetarios_id',
        'observaciones',
        'nombre_comercio',
        'tipo_documento',
        'status',
    ];


    public function detalles()
    {
        return $this->hasMany(GastoDetalle::class, 'gasto_encabezado_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function fondoMonetario()
    {
        return $this->belongsTo(FondoMonetario::class, 'fondos_monetarios_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Asegúrate que tu tabla tiene esta columna
    }
}
