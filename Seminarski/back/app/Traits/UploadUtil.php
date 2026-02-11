<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
trait UploadUtil
{
    public function upload($file, $naziv)
    {
        
    $sanitizedNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $naziv);
    $extension = $file->getClientOriginalExtension();
    $filename = 'logo_' . time() . '.' . $extension; 
    $path = 'teams/' . $sanitizedNaziv;
    Log::info('Uploading file: ' . $filename . ' to path: ' . $path);
    $pathFile = $file->storeAs($path, $filename, "s3");
    Log::info('File uploaded to S3 with path: ' . $pathFile);
    $url = Storage::disk('s3')->url($pathFile);
    Log::info('File URL: ' . $url);
    return $url;
    }
}
