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
       Schema::create('clan_ucesce', function (Blueprint $table) {
            $table->foreignId('clan_id')->constrained('clanovi')->onDelete('cascade');
            $table->foreignId('dogadjaj_id')->constrained('dogadjaji')->onDelete('cascade');
            $table->foreignId('tim_id')->constrained('timovi')->onDelete('cascade');
            $table->primary(['clan_id', 'dogadjaj_id', 'tim_id'], 'clan_ucesce_primary'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clan_ucesce', function (Blueprint $table) {
            //
        });
    }
};
