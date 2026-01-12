import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import PageHeader from "../components/PageHeader";
import DogadjajCard from "../components/DogadjajCard";
import BackButton from "../components/BackButton";
import Loader from "../components/Loader";

const Dogadjaji = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [dogadjaji, setDogadjaji] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterNaziv, setFilterNaziv] = useState("");
  const [samoOmiljeni, setSamoOmiljeni] = useState(false);

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchDogadjaji = async () => {
      setLoading(true);
      try {
        const baseRoute = location.state?.fetchUrl || `/dogadjaji`;
        const response = await api.get(baseRoute, {
          params: {
            sezona_id: id,
            naziv: filterNaziv,
            omiljeni: samoOmiljeni ? 1 : 0,
          },
        });
        setDogadjaji(response.data.data);
      } catch (error) {
        console.error("Greška prilikom učitavanja događaja:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDogadjaji();
  }, [samoOmiljeni, id, filterNaziv, location.state?.fetchUrl]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <div className="p-8 md:p-12 w-full">
        <BackButton />
        <PageHeader
          title="Događaji"
          highlight={`#${id}`}
          subtitle="Hronološki pregled kola i rezultata"
        >
          <button
            onClick={() => navigate(`/sezone/${id}/rang-lista`)}
            className="group relative flex items-center gap-6 bg-white border-2 border-yellow-400/30 p-2 pr-10 rounded-[0.5rem] shadow-xl shadow-yellow-500/5 hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <div className="text-left p-2">
              <p className="text-[10px] font-black uppercase text-yellow-600 tracking-widest leading-none mb-1">
                Poredak
              </p>
              <p className="text-lg font-black uppercase tracking-tighter text-gray-900">
                Rang Lista Sezone
              </p>
            </div>
          </button>

          <div className="flex flex-wrap items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <FormInput
              label="Pretraži po nazivu"
              placeholder="Unesite naziv..."
              value={filterNaziv}
              onChange={(e) => setFilterNaziv(e.target.value)}
            />

            {userRole === "tim" && (
              <FormInput
                label="Samo Omiljeni"
                type="toggle"
                checked={samoOmiljeni}
                onChange={() => setSamoOmiljeni(!samoOmiljeni)}
              />
            )}
          </div>
        </PageHeader>

        {loading ? (
          <Loader message="Ucitavanje dogadjaja..." />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {dogadjaji.length > 0 ? (
              dogadjaji.map((d) => (
                <DogadjajCard
                  key={d.id}
                  d={d}
                  onNavigateRang={() => navigate(`/dogadjaj/${d.id}/rang`)}
                />
              ))
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold italic text-lg">
                  Nema pronađenih događaja za zadate kriterijume.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dogadjaji;
