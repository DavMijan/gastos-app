<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gastos_detalle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gasto_encabezado_id')->constrained('gastos_encabezado')->onDelete('cascade');
            $table->foreignId('tipo_gasto_id')->constrained('tipos_gasto')->onDelete('cascade');
            $table->decimal('monto', 12, 2);
            $table->integer('status')->default(1); // 1: activo, 0: inactivo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gastos_detalle');
    }
};
