<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sezona extends Model
{
    protected $table = 'sezone';
    protected $fillable = ['pocetak', 'kraj'];


    protected $casts = [
        'pocetak' => 'date', 
        'kraj' => 'date', 
    ];

    public function dogadjaji()
    {
        return $this->hasMany(Dogadjaj::class);
    }
}
