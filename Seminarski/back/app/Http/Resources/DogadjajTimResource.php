<?php

namespace App\Http\Resources;



use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;
class DogadjajTimResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
   public function toArray(Request $request): array
{
  
    $dogadjajId = $request->route('dogadjaj_id') 
                  ?? $request->input('dogadjaj_id') 
                  ?? ($this->pivot ? $this->pivot->dogadjaj_id : null);

    return [
        'tim_id' => $this->id,
        'naziv_tima' => $this->naziv,
        'logo' => $this->logo ? asset($this->logo) : null,
        'score' => $this->whenPivotLoaded('dogadjaj_tim', function () {
            return $this->pivot->score;
        }),
        
     
        'clanovi_link' => $dogadjajId ? route('clanovi.ucesce', [
            'dogadjaj_id' => $dogadjajId, 
            'tim_id' => $this->id
        ]) : null,
    ];
}
}
