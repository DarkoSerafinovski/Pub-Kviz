import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import DataTable from "../components/DataTable";
import TeamRow from "../components/TeamRow";
import EmptyState from "../components/EmptyState";

const RangListaSezone = () => {
  const { id } = useParams();
  const [podaci, setPodaci] = useState([]);
  const [sezonaInfo, setSezonaInfo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRangLista = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/sezone/${id}/rang`);
        setPodaci(response.data.data);
        setSezonaInfo(response.data.sezona);
      } catch (error) {
        console.error("Greška pri učitavanju rang liste:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRangLista();
  }, [id]);

  if (loading) return <Loader fullPage message="Učitavam tabelu šampiona..." />;

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 pb-20">
      <Navbar />

      <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>

        <PageHeader
          title="Generalni"
          highlight="Plasman"
          subtitle={`Sezona: ${sezonaInfo}`}
        />

        {podaci.length > 0 ? (
          <div className="mt-10">
            <DataTable headers={["Pozicija", "Tim", "Ukupno Bodova"]}>
              {podaci.map((tim, index) => (
                <TeamRow
                  key={tim.tim_id}
                  index={index}
                  tim={tim}
                  points={tim.score}
                />
              ))}
            </DataTable>
          </div>
        ) : (
          <EmptyState message="Još uvek nema rezultata za ovu sezonu." />
        )}
      </div>
    </div>
  );
};

export default RangListaSezone;
