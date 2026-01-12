const DogadjajCard = ({ d, onNavigateRang }) => (
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
          <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
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
          {d.prijavljen && (
            <span className="bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600">
              ✓ Prijavljeni ste
            </span>
          )}
        </div>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-4 mt-8 lg:mt-0">
      <button
        onClick={onNavigateRang}
        className="px-8 py-4 rounded-2xl border-2 border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-yellow-400 hover:text-yellow-600 transition-all flex items-center gap-2"
      >
        <span>🏆</span> Rezultati Kola
      </button>
    </div>
  </div>
);

export default DogadjajCard;
