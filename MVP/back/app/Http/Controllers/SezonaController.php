<?php

namespace App\Http\Controllers;

use App\Http\Resources\SezonaResource;
use App\Http\Resources\DogadjajTimResource;
use App\Models\Sezona;
use App\Models\Tim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SezonaController extends Controller
{
   
    public function store(Request $request)
    {
        
        $sezona = null;

        try {

            if (Auth::user()->role !== 'moderator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Neautorizovan pristup. Samo moderatori mogu kreirati sezonu.',
                ], 401);
            }

            $request->validate([
                'pocetak' => 'required|date|after:today',
                'kraj' => 'required|date|after:pocetak',
            ]);
            
            DB::transaction(function () use ($request, &$sezona) {
                
              
                $sezona = Sezona::create([
                    'pocetak' => $request->pocetak,
                    'kraj' => $request->kraj,
                ]);

            }); 

           
            if ($sezona) {
                return response()->json([
                    'success' => true,
                    'message' => 'Uspesno dodata sezona',
                    'data' => new SezonaResource($sezona),
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


    public function index(Request $request)
    {
        try {
          

            $query = Sezona::query();

            $filterPocetak = $request->input('pocetak');
            $filterKraj = $request->input('kraj');
            
          
            if ($filterPocetak || $filterKraj) {
                
                $query->where(function ($q) use ($filterPocetak, $filterKraj) {
                    
                    if ($filterPocetak) {
                        $q->orWhere(function ($qPocetak) use ($filterPocetak) {
                            $datum = date('Y-m-d', strtotime($filterPocetak));
                            $godinaMesec = date('Y-m', strtotime($filterPocetak));
                            $godina = date('Y', strtotime($filterPocetak));
                            
                            $qPocetak->where('pocetak', $datum) 
                                     ->orWhere(DB::raw("DATE_FORMAT(pocetak, '%Y-%m')"), $godinaMesec) 
                                     ->orWhere(DB::raw("YEAR(pocetak)"), $godina);
                        });
                    }

                    if ($filterKraj) {
                        $q->orWhere(function ($qKraj) use ($filterKraj) {
                            $datum = date('Y-m-d', strtotime($filterKraj));
                            $godinaMesec = date('Y-m', strtotime($filterKraj));
                            $godina = date('Y', strtotime($filterKraj));
                            
                            $qKraj->where('kraj', $datum) 
                                  ->orWhere(DB::raw("DATE_FORMAT(kraj, '%Y-%m')"), $godinaMesec) 
                                  ->orWhere(DB::raw("YEAR(kraj)"), $godina); 
                        });
                    }
                });
            }
            
         
            if ($filterPocetak || $filterKraj) {
                
                $datumZaSortiranje = $filterPocetak ?? $filterKraj;
                $godinaMesecZaSortiranje = date('Y-m', strtotime($datumZaSortiranje));
                $godinaZaSortiranje = date('Y', strtotime($datumZaSortiranje));
                
                $kolonaZaSortiranje = $filterPocetak ? 'pocetak' : 'kraj';

                $query->orderByRaw(
                 
                    "CASE WHEN {$kolonaZaSortiranje} = '{$datumZaSortiranje}' THEN 1 ELSE 4 END ASC"
                )->orderByRaw(
                   
                    "CASE WHEN DATE_FORMAT({$kolonaZaSortiranje}, '%Y-%m') = '{$godinaMesecZaSortiranje}' THEN 2 ELSE 4 END ASC"
                )->orderByRaw(
                    
                    "CASE WHEN YEAR({$kolonaZaSortiranje}) = '{$godinaZaSortiranje}' THEN 3 ELSE 4 END ASC"
                )->orderBy($kolonaZaSortiranje, 'asc'); 
            }
            else {

                 $query->orderBy('pocetak', 'desc');
                 }
            
           
            $sezone = $query->paginate(5);

            return response()->json([
                'success' => true,
                'message' => 'Lista sezona uspešno učitana.',
                'data' => SezonaResource::collection($sezone),
                'meta' => [
                    'total' => $sezone->total(),
                    'per_page' => $sezone->perPage(),
                    'current_page' => $sezone->currentPage(),
                    'last_page' => $sezone->lastPage(),
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
    

    public function rangListaSezone(Request $request, $sezona_id)
    {
        try {
          
           
            $sezona = Sezona::findOrFail($sezona_id);
            
            $timovi = Tim::whereHas('dogadjaji', function ($query) use ($sezona_id) {
                $query->where('sezona_id', $sezona_id);
            })
            ->withSum(['dogadjaji as total_score' => function ($query) use ($sezona_id) {
                $query->where('sezona_id', $sezona_id);
            }], 'dogadjaj_tim.score')
            ->orderBy('total_score', 'desc')
            ->get();

            $timovi->each(function ($tim) {
               $pivotData = [
                    'score' => $tim->total_score ?? 0,
                    'dogadjaj_id' => null,
             ];
             $pivot = $tim->newPivot($tim, $pivotData, 'dogadjaj_tim', true);
             $tim->setRelation('pivot', $pivot);
            });

            return response()->json([
                'success' => true,
                'message' => 'Generalni plasman za sezonu uspešno učitan.',
                'sezona' => $sezona->pocetak->format('d.m.Y') . ' / ' . $sezona->kraj->format('d.m.Y'),
                'data' => DogadjajTimResource::collection($timovi),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sezona nije pronađena.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom obrade zahteva.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
   
} 