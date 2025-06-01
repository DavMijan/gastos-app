<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipos_gasto', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique(); // Autogenerado, ej: TG001
            $table->string('nombre');
            $table->integer('status')->default(1); // 1: activo, 0: inactivo
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipos_gasto');
    }
};
