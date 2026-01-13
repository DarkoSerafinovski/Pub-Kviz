<?php
 
namespace App\Http\Controllers;
 
use App\Models\User;
use App\Models\Tim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use App\Traits\UploadUtil;
use Illuminate\Support\Facades\DB;
class AuthController extends Controller
{
     use UploadUtil;
   public function register(Request $request)
{
   
    try {
      

        $request->validate([
        'naziv' => 'required|string|max:255|unique:users,username',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
        'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'role' => 'required|string|in:tim',
        ], [     
            'naziv.required' => 'Morate uneti naziv tima.',
            'naziv.unique' => 'Tim sa ovim nazivom je već registrovan.',
            'naziv.max' => 'Naziv ne može biti duži od 255 karaktera.',

            'email.required' => 'Email adresa je obavezna.',
            'email.email' => 'Format email adrese nije ispravan.',
            'email.unique' => 'Ovaj email je već zauzet, pokušajte sa drugim.',

            'password.required' => 'Lozinka je obavezna.',
            'password.min' => 'Lozinka mora imati najmanje 8 karaktera.',

            'logo.image' => 'Fajl mora biti slika (jpg, png, svg...).',
            'logo.max' => 'Slika ne sme biti veća od 2MB.',

            'role.required' => 'Uloga korisnika je obavezna.',
            'role.in' => 'Izabrana uloga nije validna.',
        ]);


         $user = null;
        $token = null;

        DB::transaction(function () use ($request, &$user, &$token) {
            
        
            $user = User::create([
                'username'=> $request->naziv,
                'email'=> $request->email,
                'password'=> Hash::make($request->password),
                'role'=>$request->role,
            ]);

           
            $team = Tim::create([
                'naziv'=> $request->naziv,
                'logo'=> $this->upload($request->file('logo'), $request->naziv),
                'user_id'=> $user->id
            ]);

           
            $token = $user->createToken('auth_token')->plainTextToken;

        });

      
        return response()->json([
            'success'=> true,
            'data'=> $user, 
            'access_token'=> $token, 
            'token_type'=> 'Bearer'
        ]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Greška pri validaciji unosa',
            'errors' => $e->errors(),
        ], 422); 
        
    } catch (\Exception $e) {
     
        return response()->json([
            'success' => false,
            'message' => 'Registracija nije uspesna. ' . $e->getMessage(),
            'error' => $e->getMessage(),
        ], 500); 
    }
}
 
    public function login(Request $request)
{
  
    if(!Auth::attempt($request->only('email','password'))){
        return response()->json(['success'=> false]);
    }

  
    $user = User::where('email', $request['email'])->firstOrFail();

  
    $token = $user->createToken('auth_token')->plainTextToken;

    $tim = \DB::table('timovi')->where('user_id', $user->id)->first();
    $timId = $tim ? $tim->id : null;

    return response()->json([
        'success' => true,
        'data' => $user, 
        'tim_id' => $timId, 
        'access_token' => $token, 
        'token_type' => 'Bearer',
        'role' => $user->role
    ]);
}
 
    public function logout(Request $request)
    {
       $request->user()->tokens()->delete();
       return response()->json(['message'=> 'Successfully logged out!']);
    }




}