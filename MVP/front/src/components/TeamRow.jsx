import React from "react";

const TeamRow = ({ index, logo, name, score }) => {
  const getRankStyle = (idx) => {
    if (idx === 0)
      return "bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-200";
    if (idx === 1) return "bg-slate-300 text-slate-700";
    if (idx === 2) return "bg-amber-600 text-white";
    return "bg-gray-100 text-gray-400";
  };

  return (
    <tr className="group border-b border-gray-50 last:border-0 hover:bg-indigo-50/50 transition-all">
      <td className="p-6">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${getRankStyle(
            index
          )}`}
        >
          {index + 1}
        </div>
      </td>

      <td className="p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={logo}
              alt={name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform"
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/150")
              }
            />
          </div>
          <div>
            <p className="text-xl font-black uppercase italic tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
              {name}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Pub Kviz Takmičar
            </p>
          </div>
        </div>
      </td>

      <td className="p-6 text-right">
        <div className="inline-flex flex-col items-end">
          <span className="text-4xl font-black text-gray-900 tabular-nums leading-none">
            {score}
          </span>
          <span className="text-[9px] font-black uppercase text-indigo-500 mt-1 tracking-tighter">
            Points
          </span>
        </div>
      </td>
    </tr>
  );
};

export default TeamRow;
