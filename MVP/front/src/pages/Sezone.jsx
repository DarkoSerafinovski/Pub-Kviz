import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import FormInput from "../components/FormInput";
import SezonaCard from "../components/SezonaCard";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";

const Sezone = () => {
  const [sezone, setSezone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ pocetak: "", kraj: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSezone = async () => {
      setLoading(true);
      try {
        const response = await api.get("/sezone", {
          params: {
            pocetak: filters.pocetak,
            kraj: filters.kraj,
          },
        });
        setSezone(response.data.data);
      } catch (error) {
        console.error("Greška pri učitavanju:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSezone();
  }, [filters.pocetak, filters.kraj]);

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

          <div className="flex flex-wrap items-end gap-4 bg-white p-6 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100">
            <div className="w-40">
              <FormInput
                label="Od datuma"
                type="date"
                onChange={(e) =>
                  setFilters({ ...filters, pocetak: e.target.value })
                }
              />
            </div>
            <div className="w-40">
              <FormInput
                label="Do datuma"
                type="date"
                onChange={(e) =>
                  setFilters({ ...filters, kraj: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {loading ? (
          <Loader message="Ucitavanje sezona..." />
        ) : (
          <>
            {sezone.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sezone.map((sezona) => (
                  <SezonaCard
                    key={sezona.id}
                    id={sezona.id}
                    period={sezona.period}
                    status={sezona.status}
                    onViewDetails={() =>
                      navigate(`/sezone/${sezona.id}/dogadjaji`, {
                        state: { fetchUrl: sezona.dogadjaji },
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold italic">
                  Nema pronađenih sezona za izabrani period.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sezone;
