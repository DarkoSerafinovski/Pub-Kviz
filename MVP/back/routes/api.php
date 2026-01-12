<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SezonaController;
use App\Http\Controllers\DogadjajController;
use App\Http\Controllers\TimController;
use App\Http\Controllers\ClanController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {

    

     Route::post('/logout', [AuthController::class, 'logout']);
     Route::post('/sezone',[SezonaController::class,'store']);
     Route::get('/sezone',[SezonaController::class,'index']);
     Route::get('/sezone/{sezona_id}/rang',[SezonaController::class,'rangListaSezone']);
     
     Route::put('/dogadjaji/{id}',[DogadjajController::class,'update']);
     Route::post('/dogadjaji',[DogadjajController::class,'store']);
     Route::get('/dogadjaji',[DogadjajController::class,'index'])->name('dogadjaji.index');
     Route::get('/dogadjaji/{dogadjaj_id}/rang', [DogadjajController::class, 'rangListaDogadjaja'])->name('dogadjaj.rang_lista');
     Route::get('/dogadjaji/{id}',[DogadjajController::class,'show']);
     Route::put('/timovi/dogadjaj/azuriraj-rezultat', [DogadjajController::class, 'azuriranjeRezultata']);
     
     
     Route::get('/dogadjaji/{dogadjaj_id}/timovi/{tim_id}/clanovi', [ClanController::class, 'ucesceNaDogadjaju'])->name('clanovi.ucesce');
     
     Route::get('/timovi/statistika', [TimController::class, 'statistika']);
     Route::post('/dogadjaji/prijava', [TimController::class, 'prijavaTima']);
     Route::post('users/dogadjaji/dodaj-u-omiljene',[TimController::class,'dodajUOmiljene']);
     Route::delete('users/dogadjaji/ukloni-iz-omiljenih/{id}',[TimController::class,'ukloniIzOmiljenih']);
     Route::put('/tim/dogadjaj/{dogadjaj_id}/promena-clanova-za-dogadjaj',[TimController::class,'promenaClanovaZaDogadjaj']);

     Route::get('/clanovi/svi',[ClanController::class,'prikazSvihClanova']);
     
     
});
