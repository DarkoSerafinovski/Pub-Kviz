import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import BackButton from "../components/BackButton";
import Loader from "../components/Loader";

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
          <div className="space-y-4">
            {/* Tabela sa rezultatima */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest">
                      Pozicija
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest">
                      Tim
                    </th>
                    <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest">
                      Ukupno Bodova
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {podaci.map((tim, index) => (
                    <tr
                      key={index}
                      className={`group border-b border-gray-50 last:border-0 hover:bg-indigo-50/30 transition-colors`}
                    >
                      <td className="p-6">
                        <div
                          className={`
                          w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm
                          ${
                            index === 0
                              ? "bg-yellow-400 text-yellow-900"
                              : index === 1
                              ? "bg-gray-300 text-gray-700"
                              : index === 2
                              ? "bg-orange-300 text-orange-900"
                              : "bg-gray-50 text-gray-400"
                          }
                        `}
                        >
                          {index + 1}.
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={tim.logo}
                            alt={tim.naziv_tima}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/150")
                            } // Fallback za sliku
                          />
                          <span className="text-xl font-black uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                            {tim.naziv_tima}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <span className="text-3xl font-black text-gray-900 tabular-nums">
                          {tim.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold italic text-lg">
              Još uvek nema rezultata za ovu sezonu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RangListaSezone;
