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


class TimController extends Controller
{
   
   
    public function dodajUOmiljene(Request $request){
       
        try {
           
            $user = Auth::user();
            if($user->role!=='tim'){
                return response()->json([
                    'error' => 'Nemate dozvolu za ovu funkciju. Samo timovi mogu dodavati dogadjaje u omiljene',
                ], 403); 
            }
            

             $request->validate([
                'dogadjaj_id' => 'required|integer|exists:dogadjaji,id',
            ]);

            $tim = Tim::where('user_id',$user->id)->first();
            $dogadjaj = Dogadjaj::find($request->dogadjaj_id);

         
            if (!$tim->omiljeniDogadjaji->contains($dogadjaj->id)) {
                $tim->omiljeniDogadjaji()->attach($dogadjaj->id);
            }else{
                  return response()->json([
                'success' => false,
                'message' => 'Dogadjaj je vec prisustan u listi omiljenih',
            ], 400);
            }

             return response()->json([
                'success' => true,
                'message' => 'Dogadjaj je uspesno dodat u listu omiljenih',
            ], 200);
           
        }

        catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji unosa.',
                'errors' => $e->errors(),
            ], 422); 
            
        } 
        
         catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
              return response()->json([
                'success' => false,
                'message' => 'Događaj ili Tim nije pronađen.',
            ], 404); 
             
        }

        catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom obrade zahteva.',
                'error' => $e->getMessage(),
            ], 500); 
        }
    
    }


     public function ukloniIzOmiljenih(Request $request,$id){
       
        try {
           
            $user = Auth::user();
            if($user->role!=='tim'){
                return response()->json([
                    'error' => 'Nemate dozvolu za ovu funkciju. Samo timovi mogu ukloniti dogadjaje iz liste omiljenih',
                ], 403); 
            }
            
              
           
            $tim = Tim::where('user_id',$user->id)->first();
            $dogadjaj = Dogadjaj::findOrFail($id);

            
         
            if ($tim->omiljeniDogadjaji->contains($id)) {
                $tim->omiljeniDogadjaji()->detach($id);
            }else{
                  return response()->json([
                'success' => false,
                'message' => 'Dogadjaj koji pokusavate da uklonite se ne nalazi u listi omiljenih',
            ], 400);
            }

             return response()->json([
                'success' => true,
                'message' => 'Dogadjaj je uspesno uklonjen iz liste omiljenih',
            ], 200);
           
        }
        
         catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
              return response()->json([
                'success' => false,
                'message' => 'Događaj ili Tim nije pronađen.',
            ], 404); 
             
        }

        catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom obrade zahteva.',
                'error' => $e->getMessage(),
            ], 500); 
        }
    
    }



    public function prijavaTima(Request $request)
    {
       
        $dogadjaj = null;
        $tim = null;

        try {
            
            if(Auth::user()->role !== 'tim') {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup ovoj ruti.Samo korisnici sa ulogom tim mogu se prijaviti za konkretan dogadjaj .',
                ], 401);
            }

           
            $tim = Tim::where('user_id', Auth::id())->first();
            
            if (!$tim) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vas korisnicki nalog ne pripada nijednom timu.',
                ], 403);
            }
            
          
            $request->validate([
                'dogadjaj_id' => 'required|integer|exists:dogadjaji,id',
                'clanovi' => 'required|array|min:1', 
                'clanovi.*.id' => 'sometimes|nullable|integer|exists:clanovi,id',
                'clanovi.*.ime' => 'required|string|max:50',
                'clanovi.*.prezime' => 'required|string|max:50',
            ]);

            
            $dogadjaj = Dogadjaj::findOrFail($request->dogadjaj_id);
            $dogadjajId = $dogadjaj->id;
            $timId = $tim->id;
            

            $vecPrijavljen = $dogadjaj->timovi()->where('tim_id', $tim->id)->exists();

            if ($vecPrijavljen) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vaš tim je već prijavljen za ovaj događaj.',
                ], 400);
            }
            
            if ($dogadjaj->datumOdrzavanja->isPast()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Prijava nije moguća. Događaj je već počeo ili je završen.',
                ], 400); 
            }
            
       
            DB::transaction(function () use ($request, $dogadjaj, $timId, $dogadjajId) {
                $dogadjaj->timovi()->attach($timId, ['score' => 0]);
                $clanoviData = $request->clanovi;
                
                foreach ($clanoviData as $clanData) {

                    $clan = null;

                    if (isset($clanData['id'])) {
                        $clan = Clan::find($clanData['id']);
                    }
                    
                    if (!isset($clan) || !$clan) {
                         $clan = Clan::create([
                            'ime' => $clanData['ime'],
                            'prezime' => $clanData['prezime'],
                        ]);
                    }

                    Log::info($clan->id);
                 
                    DB::table('clan_ucesce')->insert([
                        'clan_id' => $clan->id,
                        'dogadjaj_id' => $dogadjajId,
                        'tim_id' => $timId,
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
                
            });

           
            $tim->load(['dogadjaji' => function($query) use ($dogadjajId) {
                $query->where('dogadjaj_id', $dogadjajId);
            }]);
            
          
            $prijava = $tim->dogadjaji->first(); 

            if ($prijava) {
                return response()->json([
                    'success' => true,
                    'message' => "Tim '{$tim->naziv}' je uspešno prijavljen za događaj '{$dogadjaj->naziv}'.",
                    'data' => new DogadjajTimResource($tim), 
                ], 201);
            }

        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Greška pri validaciji.', 'errors' => $e->errors()], 422); 
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
             return response()->json(['success' => false, 'message' => 'Događaj ili Tim nije pronađen.'], 404);
             
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Došlo je do greške prilikom obrade prijave.', 'error' => $e->getMessage()], 500); 
        }
    }


     public function promenaClanovaZaDogadjaj(Request $request, $dogadjaj_id)
{
    try {
      
        if (Auth::user()->role !== 'tim') {
            return response()->json([
                'success' => false,
                'message' => 'Samo korisnici sa ulogom tim mogu menjati sastav.',
            ], 401);
        }

       
        $tim = Tim::where('user_id', Auth::id())->first();
        if (!$tim) {
            return response()->json(['success' => false, 'message' => 'Nalog ne pripada timu.'], 403);
        }

      
        $request->validate([
            'clanovi' => 'required|array|min:1',
            'clanovi.*.id' => 'sometimes|nullable|integer|exists:clanovi,id',
            'clanovi.*.ime' => 'required|string|max:50',
            'clanovi.*.prezime' => 'required|string|max:50',
        ]);

        $dogadjaj = Dogadjaj::findOrFail($dogadjaj_id);
        $timId = $tim->id;
        $dogadjajId = $dogadjaj->id;

     

        $prijavljen = DB::table('dogadjaj_tim')
                        ->where('dogadjaj_id', $dogadjajId)
                        ->where('tim_id', $timId)
                        ->exists();

        if (!$prijavljen) {
            return response()->json([
                'success' => false,
                'message' => 'Niste prijavljeni na ovaj događaj, pa ne možete menjati clanove tima.',
            ], 403); 
        }


        if ($dogadjaj->datumOdrzavanja->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Izmena nije moguća jer je događaj u prošlosti.',
            ], 400);
        }

     
        DB::transaction(function () use ($request, $timId, $dogadjajId) {
        
            DB::table('clan_ucesce')
                ->where('tim_id', $timId)
                ->where('dogadjaj_id', $dogadjajId)
                ->delete();

          
            foreach ($request->clanovi as $clanData) {
                $clan = null;

              
                if (isset($clanData['id'])) {
                    $clan = Clan::find($clanData['id']);
                }

                if (!$clan) {
                    $clan = Clan::create([
                        'ime' => $clanData['ime'],
                        'prezime' => $clanData['prezime'],
                    ]);
                }

               
                DB::table('clan_ucesce')->insert([
                    'clan_id' => $clan->id,
                    'dogadjaj_id' => $dogadjajId,
                    'tim_id' => $timId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });


        return response()->json([
            'success' => true,
            'message' => 'Clanovi tima uspešno ažurirani za izabrani dogadjaj.',
            'data' => new DogadjajTimResource($tim->load(['dogadjaji' => function($q) use ($dogadjajId) {
                $q->where('dogadjaj_id', $dogadjajId);
            }]))
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false, 
            'message' => 'Greška pri izmeni clanova tima za izabrani dogadjaj.', 
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function statistika()
    {
        try {
            $user = Auth::user();
            if ($user->role !== 'tim') {
                return response()->json(
                    ['success' => false,
                     'message' => 'Samo timovi mogu videti svoju statistiku.'], 403);
            }

            $tim = Tim::where('user_id', $user->id)->first();
            if (!$tim) {
                return response()->json(
                    ['success' => false, 
                    'message' => 'Tim nije pronađen.'], 404);
            }

            $timId = $tim->id;

           
            $opstaStatistika = DB::table('dogadjaj_tim')
                ->where('tim_id', $timId)
                ->select(
                    DB::raw('COUNT(dogadjaj_id) as ukupan_broj_dogadjaja'),
                    DB::raw('SUM(score) as ukupan_broj_poena'),
                    DB::raw('MAX(score) as maksimalni_poeni'),
                    DB::raw('AVG(score) as prosek_poena')
                )->first();

           
            $sezoneIds = DB::table('dogadjaji')
                ->join('dogadjaj_tim', 'dogadjaji.id', '=', 'dogadjaj_tim.dogadjaj_id')
                ->where('dogadjaj_tim.tim_id', $timId)
                ->distinct()
                ->pluck('sezona_id');

            $statistikaPoSezonama = [];

            foreach ($sezoneIds as $sId) {
                $sezona = Sezona::find($sId);
                
                
                $sezonskaStat = DB::table('dogadjaj_tim')
                    ->join('dogadjaji', 'dogadjaj_tim.dogadjaj_id', '=', 'dogadjaji.id')
                    ->where('dogadjaji.sezona_id', $sId)
                    ->where('dogadjaj_tim.tim_id', $timId)
                    ->select(
                        DB::raw('COUNT(dogadjaj_tim.dogadjaj_id) as broj_dogadjaja'),
                        DB::raw('SUM(dogadjaj_tim.score) as suma_poena'),
                        DB::raw('MAX(dogadjaj_tim.score) as max_poena'),
                        DB::raw('AVG(dogadjaj_tim.score) as avg_poena')
                    )->first();

              
                $pobedeUSezoni = $this->izracunajPobede($timId, $sId);

               
                $pozicija = $this->izracunajPozicijuUSezoni($timId, $sId);

                $statistikaPoSezonama[] = [
                    "sezona_id" => $sezona->id,
                    "pocetak" => $sezona->pocetak->format('d.m.Y'),
                    "kraj" => $sezona->kraj->format('d.m.Y'),
                    "broj_dogadjaja_na_kojima_ucestvujem" => $sezonskaStat->broj_dogadjaja,
                    "ukupan_broj_poena_ostvaren_u_sezoni" => (int)$sezonskaStat->suma_poena,
                    "maksimalni_broj_poena_na_nekom_dogadjaju" => (int)$sezonskaStat->max_poena,
                    "prosecan_broj_poena_po_dogadjaju" => round($sezonskaStat->avg_poena, 2),
                    "broj_osvojenih_dogadjaja" => $pobedeUSezoni,
                    "rezultat_na_rang_listi_sezone" => $pozicija
                ];
            }
    
            $ukupnoPobeda = $this->izracunajPobede($timId);

            return response()->json([
                "success" => true,
                "data" => [
                    "ukupan_broj_dogadjaja" => $opstaStatistika->ukupan_broj_dogadjaja,
                    "sezone" => $statistikaPoSezonama,
                    "ukupan_broj_osvojenih_dogadjaja" => $ukupnoPobeda,
                    "maksimalni_broj_poena_ostvaren_na_dogadjaju" => (int)$opstaStatistika->maksimalni_poeni,
                    "prosecan_broj_poena_po_dogadjaju" => round($opstaStatistika->prosek_poena, 2),
                    "prosecan_broj_poena_po_sezoni" => count($statistikaPoSezonama) > 0 
                        ? round($opstaStatistika->ukupan_broj_poena / count($statistikaPoSezonama), 2) 
                        : 0
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    private function izracunajPobede($timId, $sezonaId = null)
    {
        $query = DB::table('dogadjaj_tim as dt1')
            ->join('dogadjaji', 'dt1.dogadjaj_id', '=', 'dogadjaji.id')
            ->where('dt1.tim_id', $timId);

        if ($sezonaId) {
            $query->where('dogadjaji.sezona_id', $sezonaId);
        }
        return $query->whereNotExists(function ($q) {
            $q->select(DB::raw(1))
                ->from('dogadjaj_tim as dt2')
                ->whereRaw('dt2.dogadjaj_id = dt1.dogadjaj_id')
                ->whereRaw('dt2.score > dt1.score');
        })->count();
    }


    private function izracunajPozicijuUSezoni($timId, $sezonaId)
    {
        $rangLista = DB::table('dogadjaj_tim')
            ->join('dogadjaji', 'dogadjaj_tim.dogadjaj_id', '=', 'dogadjaji.id')
            ->where('dogadjaji.sezona_id', $sezonaId)
            ->select('tim_id', DB::raw('SUM(score) as total_score'))
            ->groupBy('tim_id')
            ->orderBy('total_score', 'desc')
            ->get();

        return $rangLista->search(fn($item) => $item->tim_id == $timId) + 1;
    }


}