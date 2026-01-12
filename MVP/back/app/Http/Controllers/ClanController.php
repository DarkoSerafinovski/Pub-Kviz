<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClanResource;
use App\Models\Tim;
use App\Models\Clan;
use Illuminate\Http\Request;


class ClanController extends Controller
{
    public function ucesceNaDogadjaju(Request $request, $dogadjaj_id, $tim_id)
    {
        try {
           
            $tim = Tim::findOrFail($tim_id);
            $clanovi = $tim->clanoviUcesnici()
                           ->wherePivot('dogadjaj_id', $dogadjaj_id)
                           ->get();
         
            return response()->json([
                'success' => true,
                'message' => 'Lista članova tima za izabrani događaj je uspešno učitana.',
                'data' => ClanResource::collection($clanovi),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tim nije pronađen.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom učitavanja članova.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function prikazSvihClanova(Request $request)
    {
        try {
            $clanovi = Clan::all();
            return response()->json([
                'success' => true,
                'message' => 'Lista članova je uspešno učitana.',
                'data' => ClanResource::collection($clanovi),
            ], 200);

        }  catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom učitavanja članova.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



}
