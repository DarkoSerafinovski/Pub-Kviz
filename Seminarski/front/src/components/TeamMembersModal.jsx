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
        setClanovi([{ id: "", ime: "", prezime: "", isNew: false }]);
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
      const data = res.data.data.map((c) => ({ ...c, isNew: false }));
      setClanovi(
        data.length > 0
          ? data
          : canEdit
          ? [{ id: "", ime: "", prezime: "", isNew: false }]
          : []
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const validniClanovi = clanovi.filter((c) =>
      c.isNew ? c.ime.trim() !== "" : c.id !== ""
    );

    const postojeciIds = validniClanovi
      .filter((c) => !c.isNew)
      .map((c) => c.id);
    if (new Set(postojeciIds).size !== postojeciIds.length) {
      alert("Greška: Ne možete izabrati istog člana više puta!");
      return;
    }

    const finalniPodaci = validniClanovi.map((c) => {
      if (c.isNew) {
        return { id: null, ime: c.ime, prezime: c.prezime };
      } else {
        const puni = sviClanovi.find((s) => String(s.id) === String(c.id));
        return { id: puni?.id, ime: puni?.ime, prezime: puni?.prezime };
      }
    });

    if (finalniPodaci.length === 0) return alert("Unesite bar jednog člana!");

    setLoading(true);
    try {
      const payload = {
        clanovi: finalniPodaci,
        ...(mode === "signup"
          ? { dogadjaj_id: Number(dogadjajId) }
          : { tim_id: isMyTeam ? loggedInTimId : timId }),
      };

      if (mode === "signup") {
        await api.post("/dogadjaji/prijava", payload);
        alert("Uspešna prijava!");
      } else {
        await api.put(
          `/tim/dogadjaj/${dogadjajId}/promena-clanova-za-dogadjaj`,
          payload
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
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in duration-200">
        <div className="p-8 bg-indigo-600 text-white flex justify-between items-center rounded-t-[3rem]">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">
            {mode === "signup" ? "Prijava za turnir" : "Postava ekipe"}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:rotate-90 transition-transform p-2"
          >
            ✕
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex flex-col items-center py-10">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full mb-4"></div>
              <p className="italic font-bold text-gray-400">Učitavanje...</p>
            </div>
          ) : (
            <>
              {clanovi.map((clan, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-3 relative group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">
                      Član #{index + 1} {clan.isNew ? "(Novi)" : "(Postojeći)"}
                    </span>
                    {canEdit && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const novi = [...clanovi];
                            novi[index] = {
                              ...novi[index],
                              isNew: !novi[index].isNew,
                              id: "",
                              ime: "",
                              prezime: "",
                            };
                            setClanovi(novi);
                          }}
                          className="text-[10px] font-bold uppercase text-indigo-500 hover:underline"
                        >
                          {clan.isNew ? "Izaberi iz liste" : "Unesi ručno"}
                        </button>
                        <button
                          onClick={() =>
                            setClanovi(clanovi.filter((_, i) => i !== index))
                          }
                          className="text-red-400 hover:text-red-600 font-bold px-2"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {clan.isNew ? (
                      <>
                        <input
                          disabled={!canEdit}
                          placeholder="Ime"
                          value={clan.ime}
                          onChange={(e) => {
                            const novi = [...clanovi];
                            novi[index].ime = e.target.value;
                            setClanovi(novi);
                          }}
                          className="flex-1 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 font-bold focus:border-indigo-500 outline-none transition-all"
                        />
                        <input
                          disabled={!canEdit}
                          placeholder="Prezime"
                          value={clan.prezime}
                          onChange={(e) => {
                            const novi = [...clanovi];
                            novi[index].prezime = e.target.value;
                            setClanovi(novi);
                          }}
                          className="flex-1 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 font-bold focus:border-indigo-500 outline-none transition-all"
                        />
                      </>
                    ) : (
                      <select
                        disabled={!canEdit}
                        value={clan.id}
                        onChange={(e) => {
                          const novi = [...clanovi];
                          novi[index].id = e.target.value;
                          setClanovi(novi);
                        }}
                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 font-bold focus:border-indigo-500 outline-none transition-all cursor-pointer"
                      >
                        <option value="">-- Izaberi člana --</option>
                        {sviClanovi.map((s) => {
                          const vecIzabran = clanovi.some(
                            (c) =>
                              !c.isNew &&
                              String(c.id) === String(s.id) &&
                              String(c.id) !== String(clan.id)
                          );
                          return (
                            <option
                              key={s.id}
                              value={s.id}
                              disabled={vecIzabran}
                            >
                              {s.ime} {s.prezime}{" "}
                              {vecIzabran ? "(Već izabran)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>
                </div>
              ))}

              {canEdit && (
                <button
                  onClick={() =>
                    setClanovi([
                      ...clanovi,
                      { id: "", ime: "", prezime: "", isNew: false },
                    ])
                  }
                  className="w-full border-2 border-dashed border-gray-200 p-4 rounded-[2rem] text-gray-400 font-black uppercase text-[10px] tracking-widest hover:border-indigo-300 hover:text-indigo-500 transition-all"
                >
                  + Dodaj još jednog člana
                </button>
              )}
            </>
          )}
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 rounded-b-[3rem]">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-white border border-gray-200 text-gray-400 hover:bg-gray-100 transition-all"
          >
            Zatvori
          </button>
          {canEdit && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
