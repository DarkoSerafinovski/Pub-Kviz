import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useStats } from "../hooks/useStats";

const StatistikaTima = () => {
  const { stats, loading, fetchStats } = useStats();

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return <Loader fullPage message="Analiziramo tvoje rezultate..." />;
  if (!stats)
    return (
      <div className="text-center p-20 font-bold">Podaci nisu dostupni.</div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />
      <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
        <PageHeader
          title="Statistika"
          highlight="Tima"
          subtitle="Pregled tvojih postignuća kroz sve sezone"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Ukupno Događaja"
            value={stats.ukupan_broj_dogadjaja}
            color="bg-indigo-600"
          />
          <StatCard
            title="Osvojena Prva Mesta"
            value={stats.ukupan_broj_osvojenih_dogadjaja}
            color="bg-green-500"
          />
          <StatCard
            title="Rekord Poena"
            value={stats.maksimalni_broj_poena_ostvaren_na_dogadjaju}
            color="bg-amber-500"
          />
          <StatCard
            title="Prosek Poena"
            value={stats.prosecan_broj_poena_po_dogadjaju.toFixed(1)}
            color="bg-rose-500"
          />
        </div>

        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6 text-gray-800">
          Učinak po sezonama
        </h3>

        <div className="space-y-8">
          {stats.sezone.length > 0 ? (
            stats.sezone.map((sezona) => (
              <div
                key={sezona.sezona_id}
                className="bg-white rounded-[3rem] shadow-xl shadow-gray-100 overflow-hidden border border-gray-100 transition-hover duration-300 hover:shadow-indigo-100"
              >
                <div className="bg-gray-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-indigo-400 font-black uppercase tracking-widest text-xs">
                      Sezona #{sezona.sezona_id}
                    </span>
                    <h4 className="text-2xl font-black italic uppercase tracking-tight">
                      {sezona.pocetak} — {sezona.kraj}
                    </h4>
                  </div>
                  <div className="bg-indigo-600 px-6 py-3 rounded-2xl flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold opacity-80">
                      Rang u sezoni
                    </span>
                    <span className="text-2xl font-black italic">
                      {sezona.rezultat_na_rang_listi_sezone}. Mesto
                    </span>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                  <SeasonDetail
                    label="Događaja"
                    value={sezona.broj_dogadjaja_na_kojima_ucestvujem}
                  />
                  <SeasonDetail
                    label="Ukupno Poena"
                    value={sezona.ukupan_broj_poena_ostvaren_u_sezoni}
                  />
                  <SeasonDetail
                    label="Max Poena"
                    value={sezona.maksimalni_broj_poena_na_nekom_dogadjaju}
                  />
                  <SeasonDetail
                    label="Prosek"
                    value={sezona.prosecan_broj_poena_po_dogadjaju.toFixed(1)}
                  />
                </div>
              </div>
            ))
          ) : (
            <EmptyState message="Niste učestvovali ni u jednoj sezoni do sada." />
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div
    className={`${color} p-8 rounded-[2.5rem] text-white shadow-xl transform transition-transform hover:scale-105`}
  >
    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">
      {title}
    </p>
    <p className="text-4xl font-black italic tracking-tighter">{value}</p>
  </div>
);

const SeasonDetail = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
      {label}
    </span>
    <span className="text-xl font-bold text-gray-800">{value}</span>
  </div>
);

export default StatistikaTima;
