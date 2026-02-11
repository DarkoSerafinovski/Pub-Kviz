<!DOCTYPE html>
<html>
<head>
    <title>Google Auth Success</title>
</head>
<body>
    <script>
        const token = {!! $token !!};
       const frontendUrl = "{{ env('FRONTEND_URL', 'http://localhost:3000') }}";
        if (window.opener) {
            window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', token: token }, frontendUrl);
            window.close();
        } else {
            localStorage.setItem('google_token', JSON.stringify(token));
            window.location.href = frontendUrl + "/dogadjaji";
        }
    </script>
    <p>Autentikacija uspešna! Vraćanje u aplikaciju...</p>
</body>
</html>