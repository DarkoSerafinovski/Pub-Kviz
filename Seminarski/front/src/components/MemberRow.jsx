import React from "react";
import FormInput from "./FormInput";
import Button from "./Button";

const MemberRow = ({
  clan,
  index,
  canEdit,
  sviClanovi,
  clanovi, // Potrebno zbog provere duplikata u select-u
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-3 relative group">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">
          Član #{index + 1} {clan.isNew ? "(Novi)" : "(Postojeći)"}
        </span>

        {canEdit && (
          <div className="flex gap-2">
            <Button
              variant="empty"
              onClick={() =>
                onUpdate({
                  isNew: !clan.isNew,
                  id: "",
                  ime: "",
                  prezime: "",
                })
              }
              className="text-[10px] font-bold uppercase text-indigo-500 hover:underline"
            >
              {clan.isNew ? "Izaberi iz liste" : "Unesi ručno"}
            </Button>
            <button
              onClick={onRemove}
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
            <FormInput
              disabled={!canEdit}
              placeholder="Ime"
              value={clan.ime}
              onChange={(e) => onUpdate({ ime: e.target.value })}
            />
            <FormInput
              disabled={!canEdit}
              placeholder="Prezime"
              value={clan.prezime}
              onChange={(e) => onUpdate({ prezime: e.target.value })}
            />
          </>
        ) : (
          <select
            disabled={!canEdit}
            value={clan.id}
            onChange={(e) => onUpdate({ id: e.target.value })}
            className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 font-bold focus:border-indigo-500 outline-none transition-all cursor-pointer"
          >
            <option value="">-- Izaberi člana --</option>
            {sviClanovi.map((s) => {
              const vecIzabran = clanovi.some(
                (c) =>
                  !c.isNew &&
                  String(c.id) === String(s.id) &&
                  String(c.id) !== String(clan.id),
              );
              return (
                <option key={s.id} value={s.id} disabled={vecIzabran}>
                  {s.ime} {s.prezime} {vecIzabran ? "(Već izabran)" : ""}
                </option>
              );
            })}
          </select>
        )}
      </div>
    </div>
  );
};

export default MemberRow;
