import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import FormInput from "../components/FormInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (credentials = null) => {
    setLoading(true);
    setError("");

    const loginData = credentials || { email, password };

    try {
      const response = await api.post("/login", loginData);

      if (response.data.success === false) {
        setError(response.data.message || "Pogresni podaci.");
        return;
      }

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.data.role);
      localStorage.setItem("username", response.data.data.username);
      navigate("/sezone");
    } catch (err) {
      console.error("Login Error:", err);

      if (err.response) {
        setError(err.response.data.message || "Neispravni kredencijali.");
      } else {
        setError("Server nije dostupan. Proverite vezu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-6">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[3.5rem] bg-white p-12 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
        <div className="relative">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-black tracking-tighter text-gray-900 uppercase italic">
              Prijava
            </h2>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-xs font-black uppercase tracking-widest text-red-600 border border-red-100">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-bold">
                !
              </span>
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            <FormInput
              label="Email Adresa"
              type="email"
              required
              placeholder="Unesite vasu email adresu..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormInput
              label="Lozinka"
              type="password"
              required
              placeholder="Unesite vasu lozinku..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-[1.5rem] bg-gray-900 py-5 text-xs font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-indigo-600 active:scale-[0.98] disabled:bg-gray-200"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? "Provera..." : "Prijavi se"}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleLogin({
                  email: "gledalac@gmail.com",
                  password: "gledalac123",
                })
              }
              className="w-full rounded-[1.5rem] border-2 border-gray-100 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 transition-all hover:border-indigo-100 hover:text-indigo-600 active:scale-[0.98]"
            >
              Nastavi kao gost
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">
              Nemate nalog?{" "}
              <Link to="/register" className="text-indigo-600 hover:underline">
                Registrujte svoj tim
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
