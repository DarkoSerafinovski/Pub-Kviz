import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import SezonaCard from "../components/SezonaCard";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { useSezone } from "../hooks/useSezone";
import { useAuth } from "../hooks/useAuth";

const Sezone = () => {
  const navigate = useNavigate();

  const {
    sezone,
    loading,
    filters,
    updateFilters,
    paginationMeta,
    currentPage,
    setCurrentPage,
    fetchSezone,
  } = useSezone();

  const { role } = useAuth();

  const isAdmin = role === "moderator";

  useEffect(() => {
    fetchSezone();
  }, [filters, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <PageHeader
            title="Pub Kviz"
            highlight="Sezone"
            subtitle="Pregled Takmicenja"
          />

          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => navigate("/kreiraj-sezonu")}
            >
              + Nova Sezona
            </Button>
          )}

          <div className="flex flex-wrap items-end gap-4 bg-white p-6 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100">
            <div className="w-40">
              <FormInput
                label="Od datuma"
                type="date"
                value={filters.pocetak}
                onChange={(e) => updateFilters({ pocetak: e.target.value })}
              />
            </div>
            <div className="w-40">
              <FormInput
                label="Do datuma"
                type="date"
                value={filters.kraj}
                onChange={(e) => updateFilters({ kraj: e.target.value })}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <Loader message="Ucitavanje sezona..." />
        ) : sezone.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sezone.map((sezona) => (
                <SezonaCard
                  key={sezona.id}
                  {...sezona}
                  onViewDetails={() =>
                    navigate(`/sezone/${sezona.id}/dogadjaji`, {
                      state: sezona,
                    })
                  }
                />
              ))}
            </div>
            <Pagination meta={paginationMeta} onPageChange={setCurrentPage} />
          </>
        ) : (
          <EmptyState message="Nema pronađenih sezona za izabrani period." />
        )}
      </div>
    </div>
  );
};

export default Sezone;
