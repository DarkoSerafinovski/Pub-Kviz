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
       Schema::create('omiljeni_dogadjaji', function (Blueprint $table) {
            $table->foreignId('tim_id')->constrained('timovi')->onDelete('cascade');
            $table->foreignId('dogadjaj_id')->constrained('dogadjaji')->onDelete('cascade');
            $table->primary(['tim_id', 'dogadjaj_id']); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('omiljeni_dogadjaji', function (Blueprint $table) {
        });
    }
};
