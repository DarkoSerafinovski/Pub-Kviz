<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;

trait UploadUtil
{
    public function upload($file, $naziv)
    {
        
    $sanitizedNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $naziv);
    $extension = $file->getClientOriginalExtension();
    $filename = 'logo_' . time() . '.' . $extension; 
    $path = 'teams/' . $sanitizedNaziv;
    $pathFile = $file->storeAs($path, $filename, "s3");
    return Storage::disk('s3')->url($pathFile);
    }
}
