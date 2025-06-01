<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presupuesto extends Model
{
    protected $table = 'presupuestos';

    protected $fillable = [
        'user_id',
        'tipo_gasto_id',
        'mes',
        'monto',
        'status',
    ];


    public function tipoGasto()
    {
        return $this->belongsTo(TipoGasto::class);
    }
}
