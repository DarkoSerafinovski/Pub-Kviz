import Button from "./Button";

const DogadjajCard = ({
  d,
  userRole,
  onSignupClick,
  onToggleFavorite,
  onNavigateRang,
}) => (
  <div className="bg-white p-8 rounded-[3rem] border border-gray-100 flex flex-col lg:flex-row items-center justify-between group hover:border-indigo-300 transition-all shadow-sm hover:shadow-md">
    <div className="flex flex-col md:flex-row items-center gap-10">
      <div className="bg-gray-50 p-5 rounded-[2rem] text-center min-w-[120px] border border-gray-100 group-hover:bg-indigo-50 transition-colors">
        <p className="text-[10px] font-black uppercase text-indigo-600 mb-1">
          Datum
        </p>
        <p className="text-2xl font-black text-gray-900 leading-none">
          {d.datum_odrzavanja.split(" ")[0]}
        </p>
        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">
          {d.datum_odrzavanja.split(" ")[1]} h
        </p>
      </div>

      <div className="text-center md:text-left">
        <h3 className="text-3xl font-black uppercase italic text-gray-900 group-hover:text-indigo-600 transition-colors">
          {d.naziv}
        </h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
          <span className=" px-3 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
            👥 {d.broj_timova}{" "}
            {d.broj_timova === 1
              ? "Tim"
              : d.broj_timova > 1 && d.broj_timova < 5
              ? "Tima"
              : "Timova"}
          </span>
          {d.omiljeni && (
            <span className="bg-pink-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-pink-500">
              ❤️ Omiljeni
            </span>
          )}
          {userRole === "tim" &&
            (d.prijavljen ? (
              <span className="bg-emerald-50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100">
                ✓ Prijavljeni ste
              </span>
            ) : (
              <Button onClick={onSignupClick}>Prijavi Tim</Button>
            ))}
        </div>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-4 mt-8 lg:mt-0">
      {userRole === "tim" && (
        <button
          onClick={(e) => {
            onToggleFavorite();
          }}
          className={`p-4 rounded-2xl transition-all ${
            d.omiljeni
              ? "bg-red-50 text-red-500 shadow-inner"
              : "bg-gray-50 text-gray-300 hover:text-red-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={d.omiljeni ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
      )}

      <Button onClick={onNavigateRang} variant="secondary">
        🏆 Rezultati Kola
      </Button>
    </div>
  </div>
);

export default DogadjajCard;
