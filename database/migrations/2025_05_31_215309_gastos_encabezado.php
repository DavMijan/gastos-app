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
        Schema::create('gastos_encabezado', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('fecha');
            $table->foreignId('fondos_monetarios_id')->constrained()->onDelete('cascade');
            $table->string('observaciones')->nullable();
            $table->string('nombre_comercio');
            $table->enum('tipo_documento', ['Factura', 'Comprobante', 'Otro']);
            $table->integer('status')->default(1); // 1: activo, 0: inactivo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gastos_encabezado');
    }
};
