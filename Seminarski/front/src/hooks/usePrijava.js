import { useState } from "react";
import api from "../api";

export const usePrijava = () => {
  const [submitting, setSubmitting] = useState(false);

  const sacuvajPrijavu = async ({
    mode,
    siroviClanovi,
    sviClanovi,
    dogadjajId,
    timId,
  }) => {
    setSubmitting(true);
    try {
      const validniClanovi = siroviClanovi.filter((c) =>
        c.isNew ? c.ime.trim() !== "" : c.id !== "",
      );

      if (validniClanovi.length === 0) {
        throw new Error("Unesite bar jednog člana!");
      }

      const finalniPodaci = validniClanovi.map((c) => {
        if (c.isNew) {
          return { id: null, ime: c.ime, prezime: c.prezime };
        } else {
          const puni = sviClanovi.find((s) => String(s.id) === String(c.id));
          return { id: puni?.id, ime: puni?.ime, prezime: puni?.prezime };
        }
      });

      const payload = {
        clanovi: finalniPodaci,
        ...(mode === "signup"
          ? { dogadjaj_id: Number(dogadjajId) }
          : { tim_id: Number(timId) }),
      };

      if (mode === "signup") {
        await api.post("/dogadjaji/prijava", payload);
      } else {
        await api.put(
          `/tim/dogadjaj/${dogadjajId}/promena-clanova-za-dogadjaj`,
          payload,
        );
      }

      return { success: true };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message:
          e.response?.data?.message || e.message || "Greška pri čuvanju.",
      };
    } finally {
      setSubmitting(false);
    }
  };

  return { sacuvajPrijavu, submitting };
};
