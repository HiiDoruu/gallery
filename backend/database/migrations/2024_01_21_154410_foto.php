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
        Schema::create('foto', function (Blueprint $table) {
            $table->id('id_foto');
            $table->string('id_kategori');
            $table->string('judul');
            $table->string('deskripsi');
            $table->date('tanggal_unggah');
            $table->string('lokasi_file');
            $table->string('jumlah_like')->default(0);
            $table->string('jumlah_comment')->default(0);
            $table->string('id_user');
            $table->string('id_album');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foto');
    }
};
