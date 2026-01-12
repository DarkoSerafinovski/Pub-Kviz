<?php

namespace App\Http\Resources;
use App\Models\Tim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Resources\Json\JsonResource;

class DogadjajResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         $korisnik = Auth::user();
         $tim = null;
         if($korisnik->role==='tim')
            $tim = Tim::where('user_id',$korisnik->id)->first();


        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'datum_odrzavanja' => $this->datumOdrzavanja->format('d.m.Y H:i'),
            'broj_timova' =>  $this->timovi?$this->timovi->count():0,
            'omiljeni'=>$tim? $tim->omiljeniDogadjaji->contains($this->id):false,
            'prijavljen'=>$tim?$tim->dogadjaji->contains($this->id):false,
            'rang_lista' => route('dogadjaj.rang_lista', $this->id),
        ];
    }
}
