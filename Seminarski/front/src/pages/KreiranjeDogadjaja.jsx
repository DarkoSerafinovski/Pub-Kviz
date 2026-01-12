import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import FormInput from "../components/FormInput";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

const KreiranjeDogadjaja = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const periodText = location.state?.period || "";

  const [formData, setFormData] = useState({
    naziv: "",
    datumOdrzavanja: "",
    sezona_id: id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/dogadjaji", formData);
      navigate(`/sezone/${id}/dogadjaji`, { state: { period: periodText } });
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError(
          err.response?.data?.message || "Došlo je do greške. Pokušajte ponovo."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      {loading && <Loader fullPage message="Kreiranje novog kola..." />}

      <div className="p-8 md:p-12 max-w-3xl mx-auto">
        <Button type="secondary" onClick={() => navigate(-1)}>
          Nazad
        </Button>

        <PageHeader
          title="Novo"
          highlight="Kolo"
          subtitle="Zakažite novi kviz događaj u okviru tekuće sezone."
        />

        {periodText && (
          <div className="mt-6 flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl w-fit">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">
              Aktivni Period Sezone:
            </span>
            <span className="text-sm font-bold text-indigo-700">
              {periodText}
            </span>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 mt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <EmptyState message={error} />}

            <div className="space-y-6">
              <FormInput
                label="Naziv Dogadjaja"
                required
                placeholder="Unesite naziv dogadjaja (npr. Veliko Finale)"
                value={formData.naziv}
                onChange={(e) =>
                  setFormData({ ...formData, naziv: e.target.value })
                }
              />

              <FormInput
                label="Datum Odrzavanja"
                type="date"
                required
                value={formData.datumOdrzavanja}
                onChange={(e) =>
                  setFormData({ ...formData, datumOdrzavanja: e.target.value })
                }
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Objavi Dogadjaj
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KreiranjeDogadjaja;
