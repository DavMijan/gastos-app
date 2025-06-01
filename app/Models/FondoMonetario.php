<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FondoMonetario extends Model
{
    protected $table = 'fondos_monetarios';

    protected $fillable = [
        'nombre',
        'tipo',
        'status',
    ];

    // Opcional: Scope para activos
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
