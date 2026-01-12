import React, { useState, useEffect } from "react";
import api from "../api";

const TeamMembersModal = ({
  isOpen,
  onClose,
  dogadjajId,
  timId,
  mode = "view",
}) => {
  const [clanovi, setClanovi] = useState([]);
  const [sviClanovi, setSviClanovi] = useState([]);
  const [loading, setLoading] = useState(false);

  const loggedInTimId = localStorage.getItem("tim_id");
  const isMyTeam = String(loggedInTimId) === String(timId);

  const canEdit = mode === "signup" || (isMyTeam && mode === "edit");

  useEffect(() => {
    if (isOpen) {
      fetchSviMoguciClanovi();
      if (mode === "signup") {
        setClanovi([{ id: "" }]);
      } else {
        fetchTrenutniClanovi();
      }
    }
  }, [isOpen, mode, dogadjajId, timId]);

  const fetchSviMoguciClanovi = async () => {
    try {
      const res = await api.get("/clanovi/svi");
      setSviClanovi(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTrenutniClanovi = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/dogadjaji/${dogadjajId}/timovi/${timId}/clanovi`
      );
      const data = res.data.data;
      setClanovi(data.length > 0 ? data : canEdit ? [{ id: "" }] : []);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // 1. Filtriramo samo izabrane
    const izabraniSaId = clanovi.filter((c) => c.id !== "");

    // 2. Provera duplikata (Validacija)
    const jedinstveniIds = new Set(izabraniSaId.map((c) => c.id));
    if (jedinstveniIds.size !== izabraniSaId.length) {
      alert("Greška: Ne možete izabrati istog člana više puta!");
      return;
    }

    // 3. Priprema podataka za slanje
    const selektovaniClanovi = izabraniSaId.map((c) => {
      const puniPodaci = sviClanovi.find((s) => String(s.id) === String(c.id));
      return {
        id: puniPodaci?.id || null,
        ime: puniPodaci?.ime || "",
        prezime: puniPodaci?.prezime || "",
      };
    });

    if (selektovaniClanovi.length === 0) {
      return alert("Izaberite bar jednog člana!");
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await api.post("/dogadjaji/prijava", {
          dogadjaj_id: Number(dogadjajId),
          clanovi: selektovaniClanovi,
        });
        alert("Uspešna prijava!");
      } else {
        await api.put(
          `/tim/dogadjaj/${dogadjajId}/promena-clanova-za-dogadjaj`,
          {
            clanovi: selektovaniClanovi,
            tim_id: isMyTeam ? loggedInTimId : timId,
          }
        );
        alert("Postava ažurirana!");
      }
      onClose();
    } catch (e) {
      alert(e.response?.data?.message || "Greška pri čuvanju.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in duration-200">
        {/* Header */}
        <div className="p-8 bg-indigo-600 text-white flex justify-between items-center rounded-t-[3rem]">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">
            {mode === "signup" ? "Prijava za turnir" : "Postava ekipe"}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl font-light hover:rotate-90 transition-transform p-2"
          >
            ✕
          </button>
        </div>

        {/* Sadržaj - Lista Select polja */}
        <div className="p-8 overflow-y-auto space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-10">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full mb-4"></div>
              <p className="italic font-bold text-gray-400">
                Učitavanje podataka...
              </p>
            </div>
          ) : (
            <>
              {clanovi.map((clan, index) => (
                <div key={index} className="flex gap-2 group">
                  <select
                    disabled={!canEdit}
                    value={clan.id}
                    onChange={(e) => {
                      const noviNiz = [...clanovi];
                      noviNiz[index] = {
                        ...noviNiz[index],
                        id: e.target.value,
                      };
                      setClanovi(noviNiz);
                    }}
                    className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 font-bold outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 transition-all cursor-pointer"
                  >
                    <option value="">-- Izaberi člana --</option>
                    {sviClanovi.map((s) => {
                      // Proveri da li je ovaj 's.id' već izabran u nekom DRUGOM polju
                      const vecIzabran = clanovi.some(
                        (c) =>
                          String(c.id) === String(s.id) &&
                          String(c.id) !== String(clan.id)
                      );

                      return (
                        <option
                          key={s.id}
                          value={s.id}
                          disabled={vecIzabran} // Onemogući ako je već u postavi
                          className={vecIzabran ? "text-gray-300 italic" : ""}
                        >
                          {s.ime} {s.prezime}{" "}
                          {vecIzabran ? "(Već izabran)" : ""}
                        </option>
                      );
                    })}
                  </select>

                  {canEdit && (
                    <button
                      onClick={() =>
                        setClanovi(clanovi.filter((_, i) => i !== index))
                      }
                      className="bg-red-50 text-red-500 px-5 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                      title="Ukloni polje"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {canEdit && (
                <button
                  onClick={() => setClanovi([...clanovi, { id: "" }])}
                  className="w-full border-2 border-dashed border-gray-200 p-4 rounded-2xl text-gray-400 font-black uppercase text-[10px] tracking-widest hover:border-indigo-300 hover:text-indigo-500 transition-all active:scale-[0.98]"
                >
                  + Dodaj još jednog člana
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 rounded-b-[3rem]">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-white border border-gray-200 text-gray-400 hover:bg-gray-100 transition-all active:scale-95"
          >
            Zatvori
          </button>

          {canEdit && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
              ) : mode === "signup" ? (
                "Potvrdi prijavu"
              ) : (
                "Izmeni tim"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMembersModal;
