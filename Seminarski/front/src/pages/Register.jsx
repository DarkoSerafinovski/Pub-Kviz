import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [formData, setFormData] = useState({
    naziv: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "tim",
  });
  const [logoFile, setLogoFile] = useState(null);

  const { register, loading, error, setError } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      return setError("Lozinke se ne poklapaju!");
    }
    if (!logoFile) {
      return setError("Logo tima je obavezan.");
    }

    await register(formData, logoFile);
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-6">
      <div className="relative w-full max-w-lg rounded-[3.5rem] bg-white p-12 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
        <div className="relative">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">
              Novi Tim
            </h2>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 ">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <FormInput
              label="Naziv Tima"
              name="naziv"
              type="text"
              required
              placeholder="Unesite Naziv Tima..."
              onChange={(e) =>
                setFormData({ ...formData, naziv: e.target.value })
              }
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              required
              placeholder="Unesite Email Adresu..."
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Lozinka"
                type="password"
                required
                placeholder="Lozinka... "
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <FormInput
                label="Potvrda"
                type="password"
                required
                placeholder="Ponovi..."
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password_confirmation: e.target.value,
                  })
                }
              />
            </div>

            <div className="group">
              <label className="text-sm  font-black text-gray-700 uppercase ml-1">
                Logo Tima <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 relative flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 transition-all hover:border-indigo-400">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                />
                <span className="text-xs font-bold text-gray-400">
                  {logoFile ? logoFile.name : "Klikni ili prevuci sliku"}
                </span>
              </div>
            </div>

            <Button loading={loading} className="w-full" type="submit">
              Registruj Tim
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">
              Vec ste registrovani?{" "}
              <Link to="/" className="text-indigo-600 hover:underline">
                Prijavite se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
