<?php
namespace App\Http\Controllers;

use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use Illuminate\Http\Request;
use App\Models\Dogadjaj;

class GoogleCalendarController extends Controller
{
    private function getClient()
    {
        $client = new Client();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $client->addScope("https://www.googleapis.com/auth/calendar.events");
        $client->setAccessType('offline');
        $client->setPrompt('select_account consent');
        return $client;
    }

   public function getAuthUrl(Request $request)
{
    $client = $this->getClient();
    $client->setState($request->dogadjaj_id); 
    $authUrl = $client->createAuthUrl(); 
    return response()->json(['url' => $authUrl]);
}


public function callback(Request $request)
{
    $client = $this->getClient();
    
    if (!$request->has('code')) {
        return "Greška: Google nije poslao kod.";
    }

    $token = $client->fetchAccessTokenWithAuthCode($request->code);
    return response()->view('google_callback', [
        'token' => json_encode($token)
    ]);
}

    public function storeEvent(Request $request)
    {
        $dogadjaj = Dogadjaj::findOrFail($request->dogadjaj_id);
        $client = $this->getClient();
        $client->setAccessToken($request->token); 
        $service = new Calendar($client);
        $event = new Event([
            'summary' => 'Pub Kviz: ' . $dogadjaj->naziv,
            'description' => 'Prijava za kviz uspešna!',
            'start' => [
                'dateTime' => $dogadjaj->datumOdrzavanja->toRfc3339String(),
                'timeZone' => 'Europe/Belgrade',
            ],
            'end' => [
                'dateTime' => $dogadjaj->datumOdrzavanja->addHours(3)->toRfc3339String(),
                'timeZone' => 'Europe/Belgrade',
            ],
            'reminders' => [
                'useDefault' => FALSE,
                'overrides' => [
                    ['method' => 'popup', 'minutes' => 480], 
                ],
            ],
        ]);

        $calendarId = 'primary';
        $event = $service->events->insert($calendarId, $event);

        return response()->json(['success' => true, 'event_id' => $event->id]);
    }
}