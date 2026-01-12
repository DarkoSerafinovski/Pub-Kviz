import React from "react";

const SezonaCard = ({ id, period, status, onViewDetails }) => {
  const statusStyles = {
    aktivna: "bg-green-100 text-green-600 border-green-200",
    zavrsena: "bg-red-50 text-red-400 border-red-100",
  };

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-indigo-100">
      <div className="flex justify-between items-start mb-8">
        <div className="h-12 w-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xs font-black shadow-lg">
          #{id}
        </div>
        <span
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            statusStyles[status] || statusStyles.zavrsena
          }`}
        >
          ● {status}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">
          Sezona {id}
        </h3>
        <div className="flex items-center gap-2 text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-[11px] font-bold tracking-tight italic">
            {period}
          </span>
        </div>
      </div>

      <div className="mt-10">
        <button
          onClick={onViewDetails}
          className="w-full group/btn relative flex items-center justify-center gap-3 rounded-2xl bg-gray-50 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 transition-all hover:bg-indigo-600 hover:text-white"
        >
          Pregledaj događaje
          <svg
            className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-600 transition-all duration-500 group-hover:w-full"></div>
    </div>
  );
};

export default SezonaCard;
