import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import DataTable from "../components/DataTable";
import TeamRow from "../components/TeamRow";

const RangListaDogadjaja = () => {
  const { id } = useParams();
  const [podaci, setPodaci] = useState([]);
  const [naslovDogadjaja, setNaslovDogadjaja] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRangLista = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/dogadjaji/${id}/rang`);
        setPodaci(response.data.data);
        const poruka = response.data.message;
        const naziv = poruka.match(/"([^"]+)"/)?.[1] || "Rezultati Kola";
        setNaslovDogadjaja(naziv);
      } catch (error) {
        console.error("Greška pri učitavanju rang liste događaja:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRangLista();
  }, [id]);

  if (loading) return <Loader fullPage message="Učitavam poretke timova..." />;

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 pb-20">
      <Navbar />
      <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
        <BackButton />
        <PageHeader
          title="Rezultati"
          highlight="Kola"
          subtitle={`Događaj: ${naslovDogadjaja}`}
        />

        {podaci.length > 0 ? (
          <DataTable
            headers={["Rank", "Ekipa", "Osvojeni Bodovi"]}
            variant="indigo"
          >
            {podaci.map((tim, index) => (
              <TeamRow
                key={index}
                index={index}
                logo={tim.logo}
                name={tim.naziv_tima}
                score={tim.score}
              />
            ))}
          </DataTable>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
            <div className="text-5xl mb-4">🧊</div>
            <p className="text-gray-400 font-bold italic text-lg text-center w-full">
              Rezultati za ovaj događaj još uvijek nisu uneseni.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RangListaDogadjaja;
