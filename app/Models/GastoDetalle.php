<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GastoDetalle extends Model
{

    protected $table = 'gastos_detalle';

    protected $fillable = [
        'gasto_encabezado_id',
        'tipo_gasto_id',
        'monto',
        'status',
    ];


    // Relaciones
    public function encabezado()
    {
        return $this->belongsTo(GastoEncabezado::class, 'gasto_encabezado_id');
    }

    public function tipoGasto()
    {
        return $this->belongsTo(TipoGasto::class, 'tipo_gasto_id');
    }
        public function gastoEncabezado()
    {
        return $this->belongsTo(GastoEncabezado::class, 'gasto_encabezado_id'); 
    }
}
