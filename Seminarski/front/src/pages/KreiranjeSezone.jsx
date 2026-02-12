import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import FormInput from "../components/FormInput";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { useSezone } from "../hooks/useSezone";

const KreiranjeSezone = () => {
  const navigate = useNavigate();
  const { createSezona, loading, error } = useSezone();

  const [formData, setFormData] = useState({
    pocetak: "",
    kraj: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createSezona(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {loading && <Loader fullPage message="Kreiranje nove sezone..." />}

      <div className="p-8 md:p-12 max-w-3xl mx-auto">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Nazad
        </Button>

        <PageHeader
          title="Nova"
          highlight="Sezona"
          subtitle="Definišite vremenski period za novi ciklus takmičenja."
        />

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 mt-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <EmptyState message={error} sign="!" />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormInput
                label="Datum Pocetka"
                type="date"
                required
                value={formData.pocetak}
                onChange={(e) =>
                  setFormData({ ...formData, pocetak: e.target.value })
                }
              />

              <FormInput
                label="Datum Zavrsetka"
                type="date"
                required
                value={formData.kraj}
                onChange={(e) =>
                  setFormData({ ...formData, kraj: e.target.value })
                }
              />
            </div>

            <div className="pt-4">
              <Button type="submit" loading={loading} className="w-full">
                Potvrdi i Kreiraj Sezonu
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KreiranjeSezone;
