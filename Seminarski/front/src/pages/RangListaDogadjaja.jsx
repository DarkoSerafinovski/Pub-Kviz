import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import DataTable from "../components/DataTable";
import TeamRow from "../components/TeamRow";
import TeamMembersModal from "../components/TeamMembersModal";
import Button from "../components/Button";

const RangListaDogadjaja = () => {
  const { id } = useParams();
  const [podaci, setPodaci] = useState([]);
  const [naslovDogadjaja, setNaslovDogadjaja] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [modalMode, setModalMode] = useState("view");

  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "moderator";
  const navigate = useNavigate();

  const openTeamModal = (tim) => {
    setActiveTeamId(tim.tim_id);
    const loggedTeamId = localStorage.getItem("tim_id");

    setModalMode(String(loggedTeamId) === String(tim.tim_id) ? "edit" : "view");

    setIsModalOpen(true);
  };

  const handleUpdateScore = async (timId, noviScore) => {
    try {
      const formData = new FormData();

      formData.append("tim_id", Number(timId));
      formData.append("dogadjaj_id", Number(id));
      formData.append("score", Number(noviScore));
      formData.append("_method", "PUT");

      await api.post("/timovi/dogadjaj/azuriraj-rezultat", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchRangLista();
      return true;
    } catch (err) {
      if (err.response?.data?.errors) {
        console.error(
          "Validacione greške sa servera:",
          err.response.data.errors
        );
        const msg = Object.values(err.response.data.errors)[0][0];
        alert(msg);
      } else {
        console.error("Kompletna greška:", err.response?.data);
      }
      return false;
    }
  };

  const fetchRangLista = useCallback(async () => {
    try {
      const response = await api.get(`/dogadjaji/${id}/rang`);
      setPodaci(response.data.data);

      const poruka = response.data.message;
      const naziv = poruka.match(/"([^"]+)"/)?.[1] || "Rezultati Kola";
      setNaslovDogadjaja(naziv);
    } catch (error) {
      console.error("Greška pri učitavanju:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRangLista();
  }, [fetchRangLista]);

  if (loading) return <Loader fullPage message="Učitavam poretke timova..." />;

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 pb-20">
      <Navbar />
      <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
        <Button type="secondary" onClick={() => navigate(-1)}>
          Nazad
        </Button>
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
                key={tim.tim_id || index}
                index={index}
                tim={tim}
                isAdmin={isAdmin}
                onUpdate={handleUpdateScore}
                onNameClick={() => openTeamModal(tim)}
              />
            ))}
          </DataTable>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold italic text-lg text-center w-full">
              Rezultati za ovaj događaj još uvijek nisu uneseni.
            </p>
          </div>
        )}

        {isModalOpen && (
          <TeamMembersModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            dogadjajId={id}
            timId={activeTeamId}
            mode={modalMode}
          />
        )}
      </div>
    </div>
  );
};

export default RangListaDogadjaja;
