<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class SezonaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $danas = Carbon::now();

        return [
            'id' => $this->id,
            'period' => $this->pocetak->format('d.m.Y') . ' - ' . $this->kraj->format('d.m.Y'),
            'status' => $this->kraj->greaterThan($danas) ? 'aktivna' : 'zavrsena',
            'dogadjaji' => route('dogadjaji.index', ['sezona_id' => $this->id]),
        ];
    }
}
