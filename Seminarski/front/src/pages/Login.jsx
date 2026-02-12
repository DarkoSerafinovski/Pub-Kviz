import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading, error } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleGuestLogin = () => {
    login(null, null, {
      email: "gledalac@gmail.com",
      password: "gledalac123",
    });
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

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button type="submit" loading={loading} className="w-full">
              Prijavi se
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleGuestLogin}
            >
              Nastavi kao gost
            </Button>
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
