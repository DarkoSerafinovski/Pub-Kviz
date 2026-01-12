<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dogadjaj extends Model
{
    protected $table = 'dogadjaji';
    protected $fillable = ['naziv', 'datumOdrzavanja', 'sezona_id'];

    protected $casts = [
        'datumOdrzavanja' => 'datetime',
    ];

    public function sezona()
    {
        return $this->belongsTo(Sezona::class);
    }

    public function timovi()
    {
       
        return $this->belongsToMany(Tim::class, 'dogadjaj_tim') 
                    ->withPivot('score') 
                    ->withTimestamps();
    }
    
    public function clanovi()
    {
        return $this->belongsToMany(Clan::class, 'clan_ucesce', 'dogadjaj_id', 'clan_id')
                    ->withPivot('tim_id') 
                    ->withTimestamps();
    }
}
