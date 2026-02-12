import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { logout, role, username } = useAuth();

  const navigationConfig = {
    moderator: [{ name: "Sve Sezone", path: "/sezone" }],

    tim: [
      { name: "Sve Sezone", path: "/sezone" },
      { name: "Statistika Tima", path: "/statistika" },
      { name: "Lokacija", path: "/lokacija" },
    ],

    gledalac: [{ name: "Sve Sezone", path: "/sezone" }],
  };

  const currentLinks = navigationConfig[role] || navigationConfig["gledalac"];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-8">
          {currentLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          {!role || role === "gledalac" ? (
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
          ) : (
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
                className="h-10 px-4 text-[10px] font-black uppercase tracking-widest"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
