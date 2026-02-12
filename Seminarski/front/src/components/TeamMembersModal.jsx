import React, { useState, useEffect } from "react";
import { usePrijava } from "../hooks/usePrijava";
import { useClanovi } from "../hooks/useClanovi";
import { useGoogleCalendar } from "../hooks/useGoogleCalendar";
import Button from "./Button";
import MemberRow from "./MemberRow";
import Loader from "./Loader";

const TeamMembersModal = ({ onClose, dogadjajId, timId, mode = "view" }) => {
  const canEdit = mode === "signup" || mode === "edit";

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    addToCalendar,
    loading: loadingCalendar,
    showCalendarBtn,
    setShowCalendarBtn,
  } = useGoogleCalendar(dogadjajId, onClose);

  const {
    sviClanovi,
    trenutniClanovi,
    fetchSviMoguciClanovi,
    fetchTrenutniClanovi,
    loading: loadingClanovi,
  } = useClanovi();

  const { sacuvajPrijavu, submitting } = usePrijava();
  const [clanovi, setClanovi] = useState([]);

  useEffect(() => {
    fetchSviMoguciClanovi();
    setShowCalendarBtn(false);
    if (mode === "signup") {
      setClanovi([{ id: "", ime: "", prezime: "", isNew: false }]);
    } else {
      fetchTrenutniClanovi(dogadjajId, timId);
    }
  }, [mode, dogadjajId, timId]);

  useEffect(() => {
    if (trenutniClanovi.length > 0) {
      setClanovi(trenutniClanovi);
    }
  }, [trenutniClanovi]);

  const handleSave = async () => {
    const result = await sacuvajPrijavu({
      mode,
      siroviClanovi: clanovi,
      sviClanovi,
      dogadjajId,
      timId,
    });

    if (result.success) {
      setIsSuccess(true);
      alert(mode === "signup" ? "Uspešna prijava!" : "Postava ažurirana!");
      if (mode === "signup") setShowCalendarBtn(true);
      else onClose();
    } else {
      console.log(result);
      alert(result.message);
    }
  };

  const updateMember = (index, newData) => {
    const novi = [...clanovi];
    novi[index] = { ...novi[index], ...newData };
    setClanovi(novi);
  };

  const removeMember = (index) => {
    setClanovi(clanovi.filter((_, i) => i !== index));
  };

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
          {loadingClanovi ? (
            <Loader />
          ) : (
            <>
              {showCalendarBtn && (
                <Button
                  onClick={addToCalendar}
                  disabled={loadingCalendar}
                  className="bg-indigo-600"
                >
                  {loadingCalendar
                    ? "📅 Unos..."
                    : "📅 Dodaj u Google Calendar"}
                </Button>
              )}

              {clanovi.map((clan, index) => (
                <MemberRow
                  key={index}
                  index={index}
                  clan={clan}
                  clanovi={clanovi}
                  sviClanovi={sviClanovi}
                  canEdit={canEdit}
                  onUpdate={(newData) => updateMember(index, newData)}
                  onRemove={() => removeMember(index)}
                />
              ))}

              {canEdit && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    setClanovi([
                      ...clanovi,
                      { id: "", ime: "", prezime: "", isNew: false },
                    ])
                  }
                  className="w-full"
                >
                  + Dodaj još jednog člana
                </Button>
              )}
            </>
          )}
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 rounded-b-[3rem]">
          <Button variant="secondary" onClick={onClose}>
            Zatvori
          </Button>
          {canEdit && (
            <Button
              onClick={handleSave}
              disabled={submitting || isSuccess}
              variant="primary"
              className="flex-1 bg-indigo-600"
            >
              {isSuccess
                ? "✓ Prijava poslata"
                : mode === "signup"
                  ? "Potvrdi prijavu"
                  : "Izmeni tim"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMembersModal;
