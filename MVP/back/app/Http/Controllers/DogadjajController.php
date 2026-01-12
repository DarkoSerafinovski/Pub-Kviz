<?php

namespace App\Http\Controllers;

use App\Models\Dogadjaj;
use App\Models\Sezona;
use App\Models\Tim;
use App\Models\Clan;
use App\Http\Resources\DogadjajResource;
use App\Http\Resources\DogadjajTimResource; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DogadjajController extends Controller
{
   
    public function store(Request $request)
    {
        $dogadjaj = null;

        try {
           
            if (Auth::user()->role !== 'moderator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Neautorizovan pristup. Samo moderatori mogu kreirati dogadjaj.',
                ], 401);
            }

            
            $request->validate([
                'naziv' => 'required|string|max:255',
                'datumOdrzavanja' => 'required|date|after:now', 
                'sezona_id' => 'required|integer|exists:sezone,id', 
            ]);

            
            $sezona = Sezona::findOrFail($request->sezona_id);
            $datumOdrzavanja = Carbon::parse($request->datumOdrzavanja); 
           
            if ($sezona->kraj->isPast()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ne moze se kreirati dogajdjaj za izabranu sezonu jer je ona zavrsena.',
                ], 400); 
            }

          
            if ($datumOdrzavanja->isBefore($sezona->pocetak) || $datumOdrzavanja->isAfter($sezona->kraj)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datum dogadjaja za izabranu sezonu mora biti izmedju pocetka: (' . $sezona->pocetak->format('Y-m-d') . ') and kraja: (' . $sezona->kraj->format('Y-m-d') . ') .',
                ], 400); 
            }

          
            DB::transaction(function () use ($request, &$dogadjaj) {
                
                $dogadjaj = Dogadjaj::create([
                    'naziv' => $request->naziv,
                    'datumOdrzavanja' => $request->datumOdrzavanja,
                    'sezona_id' => $request->sezona_id,
                ]);

            }); 

          
            if ($dogadjaj) {
                return response()->json([
                    'success' => true,
                    'message' => 'Dogadjaj uspesno dodat za izabranu sezonu.',
                    'data' => new DogadjajResource($dogadjaj),
                ], 201); 

            }

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji unosa.',
                'errors' => $e->errors(),
            ], 422); 
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom obrade zahteva.',
                'error' => $e->getMessage(),
            ], 500); 
        }
    }



    public function update(Request $request, $id)
    {
        try {
            
            if (Auth::user()->role !== 'moderator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Neautorizovan pristup. Samo moderatori mogu izmeniti dogadjaj.',
                ], 401);
            }

            
            $dogadjaj = Dogadjaj::findOrFail($id);

           
            $request->validate([
                'naziv' => 'sometimes|required|string|max:255',
                'datumOdrzavanja' => 'sometimes|required|date|after:now', 
                'sezona_id' => 'sometimes|required|integer|exists:sezone,id', 
            ]);

          
            $newSezonaId = $request->sezona_id ?? $dogadjaj->sezona_id;
            $newDatumOdrzavanja = Carbon::parse($request->datumOdrzavanja ?? $dogadjaj->datumOdrzavanja);
            
            $sezona = Sezona::findOrFail($newSezonaId);
            
           
            if ($sezona->kraj->isPast()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ne moze se azurirati dogajdjaj za izabranu sezonu jer je ona zavrsena.',
                ], 400); 
            }

        
            if ($newDatumOdrzavanja->isBefore($sezona->pocetak) || $newDatumOdrzavanja->isAfter($sezona->kraj)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datum dogadjaja za izabranu sezonu mora biti izmedju pocetka: (' . $sezona->pocetak->format('Y-m-d') . ') i kraja: (' . $sezona->kraj->format('Y-m-d') . ') .',
                ], 400); 
            }

         
            DB::transaction(function () use ($request, $dogadjaj, $newDatumOdrzavanja, $newSezonaId) {
                
                $dogadjaj->update([
                    'naziv' => $request->naziv ?? $dogadjaj->naziv,
                    'datumOdrzavanja' => $newDatumOdrzavanja,
                    'sezona_id' => $newSezonaId,
                ]);

            }); 

            $dogadjaj->refresh();
            return response()->json([
                'success' => true,
                'message' => 'Dogadjaj uspesno azuriran.',
                'data' => new DogadjajResource($dogadjaj),
            ], 200); 
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dogadjaj ili Sezona nije pronađena.',
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji unosa.',
                'errors' => $e->errors(),
            ], 422); 
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom obrade zahteva.',
                'error' => $e->getMessage(),
            ], 500); 
        }
    }


    public function index(Request $request)
    {
        try {
           
            $request->validate([
                'sezona_id' => 'required_without:omiljeni|nullable|integer|exists:sezone,id',
                'omiljeni'=>'required_without:sezona_id|nullable|boolean',
                'naziv' => 'nullable|string|max:255',
                'datumOdrzavanja' => 'nullable|date',
            ]);

            $sezonaId = $request->sezona_id;
            $omiljeni = $request->omiljeni;
            
            if($omiljeni){

                $tim = Tim::where('user_id',Auth::id())->first();
                $query = $tim->omiljeniDogadjaji();
                
            }else{
                   $query = Dogadjaj::where('sezona_id', $sezonaId)
                             ->with('timovi');
            }
         

          
            $filterNaziv = $request->input('naziv');
            $filterDatum = $request->input('datumOdrzavanja');

          
            if ($filterNaziv) {
                $query->where('naziv', 'LIKE', '%' . $filterNaziv . '%');
            }

        
            if ($filterDatum) {
                $query->whereDate('datumOdrzavanja', $filterDatum);
            }

            $now = Carbon::now();

            $query->orderByRaw("CASE WHEN datumOdrzavanja >= '{$now->toDateTimeString()}' THEN 1 ELSE 2 END ASC")
                  ->orderBy('datumOdrzavanja', 'asc');
            
            $dogadjaji = $query->paginate(5);

            return response()->json([
                'success' => true,
                'message' => 'Lista događaja za sezonu uspešno učitana.',
                'data' => DogadjajResource::collection($dogadjaji),
                'meta' => [
                    'total' => $dogadjaji->total(),
                    'per_page' => $dogadjaji->perPage(),
                    'current_page' => $dogadjaji->currentPage(),
                    'last_page' => $dogadjaji->lastPage(),
                ],
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji unosa.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom obrade zahteva.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function rangListaDogadjaja(Request $request, $dogadjaj_id)
    {
        try {
           
            $dogadjaj = Dogadjaj::with(['timovi' => function ($query) {
                $query->orderBy('score', 'desc'); 
            }])->findOrFail($dogadjaj_id);
            
            return response()->json([
                'success' => true,
                'message' => 'Rang lista za događaj "' . $dogadjaj->naziv . '" uspešno učitana.',
                'data' => DogadjajTimResource::collection($dogadjaj->timovi),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Događaj nije pronađen.',
            ], 404); 
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom obrade zahteva.',
                'error' => $e->getMessage(),
            ], 500); 
        }
    }


    public function show(Request $request,$id){
      try {
            
         $dogadjaj = Dogadjaj::findOrFail($id);
                return response()->json([
                    'success' => true,
                    'message' => "Dogadjaj '{$dogadjaj->naziv}' je uspešno ucitan.",
                    'data' => new DogadjajResource($dogadjaj), 
                ], 201);
            }

         catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
             return response()->json(['success' => false, 'message' => 'Događaj nije pronađen.'], 404);
             
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Došlo je do greške prilikom obrade dogadjaja.', 'error' => $e->getMessage()], 500); 
        }
    }


    public function azuriranjeRezultata(Request $request)
    {
        try {
          
            if ( Auth::user()->role !== 'moderator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup za ovu metodu. Samo moderatori mogu da azuriraju rezultat dogadjaja pojedinog tima.',
                ], 401);
            }

            $request->validate([
                'dogadjaj_id' => 'required|integer|exists:dogadjaji,id',
                'tim_id'      => 'required|integer|exists:timovi,id',
                'score'       => 'required|integer|min:0',
            ]);

            $dogadjajId = $request->dogadjaj_id;
            $timId = $request->tim_id;
            $noviScore = $request->score;
            $dogadjaj = Dogadjaj::findOrFail($dogadjajId);

            if (!$dogadjaj->timovi()->where('tim_id', $timId)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Izabrani tim nije deo ovog dogadjaja.',
                ], 404);
            }

            DB::transaction(function () use ($dogadjaj, $timId, $noviScore) {
                $dogadjaj->timovi()->updateExistingPivot($timId, [
                    'score' => $noviScore
                ]);

            }); 
           
            $tim = $dogadjaj->timovi()->where('tim_id', $timId)->first();

            return response()->json([
                'success' => true,
                'message' => 'Rezultat je uspešno ažuriran.',
                'data' => new DogadjajTimResource($tim),
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom ažuriranja rezultata.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
   


   
}