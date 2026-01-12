import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Button from "./Button";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Greska na serveru prilikom odjavljivanja: ", error);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  const navLinks = (
    <div className="flex items-center gap-8">
      <Link
        to="/sezone"
        className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors"
      >
        Sve Sezone
      </Link>
      {role === "tim" && (
        <Link
          to="/statistika"
          className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-2"
        >
          Statistika Tima
        </Link>
      )}
    </div>
  );

  let authButtons;

  if (role === "gledalac" || !role) {
    authButtons = (
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900"
        >
          Prijava
        </Link>
        <Link
          to="/register"
          className="bg-gray-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md shadow-gray-200"
        >
          Registruj Tim
        </Link>
      </div>
    );
  } else {
    authButtons = (
      <div className="flex items-center gap-5 pl-6 border-l border-gray-100">
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-gray-400 leading-none">
            Dobrodošli,
          </p>
          <p className="text-sm font-black text-gray-900 tracking-tighter capitalize">
            {username}
          </p>
        </div>
        <Button
          variant="danger"
          className="h-10 w-10 p-0"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:block">{navLinks}</div>

        <div>{authButtons}</div>
      </div>
    </nav>
  );
};

export default Navbar;
