import React from "react";
import Button from "./Button";

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
          <span className="text-[11px] font-bold tracking-tight italic">
            {period}
          </span>
        </div>
      </div>

      <Button
        className="w-full mt-10"
        variant="primary"
        onClick={onViewDetails}
      >
        Pregledaj Dogadjaje
      </Button>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-600 transition-all duration-500 group-hover:w-full"></div>
    </div>
  );
};

export default SezonaCard;
