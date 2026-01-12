import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import FormInput from "../components/FormInput";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

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
      const timId = response.data.tim_id;

      if (timId) localStorage.setItem("tim_id", timId);
      navigate("/sezone");
    } catch (err) {
      console.error("Login Error:", err);
      const message =
        err.response?.data?.message ||
        "Neispravni kredencijali ili greska sa serverom.";
      setError(message);
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

          {error && <EmptyState message={error} sign="!" />}

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

            <Button type="submit" loading={loading} className="w-full">
              Prijavi se
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                handleLogin({
                  email: "gledalac@gmail.com",
                  password: "gledalac123",
                })
              }
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
