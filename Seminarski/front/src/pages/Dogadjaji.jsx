import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import PageHeader from "../components/PageHeader";
import DogadjajCard from "../components/DogadjajCard";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import TeamMembersModal from "../components/TeamMembersModal";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { useDogadjaji } from "../hooks/useDogadjaji";
import { useAuth } from "../hooks/useAuth";

const Dogadjaji = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [selectedDogadjajId, setSelectedDogadjajId] = useState(null);

  const {
    dogadjaji,
    loading,
    paginationMeta,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilters,
    toggleFavorite,
    fetchDogadjaji,
  } = useDogadjaji(id);

  const { role, loggedTimId } = useAuth();

  const isAdmin = role === "moderator";

  useEffect(() => {
    fetchDogadjaji(state?.dogadjaji);
  }, [filters, currentPage, id]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <div className="p-8 md:p-12 w-full">
        <Button type="secondary" onClick={() => navigate(-1)}>
          Nazad
        </Button>
        <PageHeader
          title="Događaji"
          highlight={`#${id}`}
          subtitle={`Trajanje: ${state?.period || "..."} `}
        >
          {isAdmin && state?.status === "aktivna" && (
            <Button
              variant="primary"
              onClick={() =>
                navigate(`/sezone/${id}/kreiraj-dogadjaj`, {
                  state,
                })
              }
            >
              + Novi Dogadjaj
            </Button>
          )}
          <Button
            onClick={() => navigate(`/sezone/${id}/rang-lista`)}
            variant="outline"
          >
            Rang Lista Sezone
          </Button>

          <div className="flex flex-wrap items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <FormInput
              label="Pretraži po nazivu"
              placeholder="Unesite naziv..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {role === "tim" && (
              <FormInput
                label="Samo Omiljeni"
                type="toggle"
                checked={filters.omiljeni}
                onChange={() => updateFilters({ omiljeni: !filters.omiljeni })}
              />
            )}
          </div>
        </PageHeader>

        {loading ? (
          <Loader fullPage message="Ucitavanje dogadjaja..." />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6">
              {dogadjaji.length > 0 ? (
                dogadjaji.map((d) => (
                  <DogadjajCard
                    key={d.id}
                    d={d}
                    userRole={role}
                    onSignupClick={() => {
                      setSelectedDogadjajId(d.id);
                      setIsSignUpOpen(true);
                    }}
                    onToggleFavorite={() => toggleFavorite(d.id, d.omiljeni)}
                    onNavigateRang={() => navigate(`/dogadjaj/${d.id}/rang`)}
                  />
                ))
              ) : (
                <EmptyState message="Nema pronađenih događaja za zadate kriterijume."></EmptyState>
              )}
            </div>
            <Pagination meta={paginationMeta} onPageChange={setCurrentPage} />
          </>
        )}
      </div>
      {isSignUpOpen && (
        <TeamMembersModal
          onClose={() => setIsSignUpOpen(false)}
          dogadjajId={selectedDogadjajId}
          timId={loggedTimId}
          mode="signup"
        />
      )}
    </div>
  );
};

export default Dogadjaji;
