<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deposito extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fondos_monetarios_id',
        'fecha',
        'monto',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fondo()
    {
        return $this->belongsTo(FondoMonetario::class, 'fondos_monetarios_id');
    }

    public function getEstadoTextoAttribute()
    {
        return $this->status === 1 ? 'Activo' : 'Anulado';
    }
}
