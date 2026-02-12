import { useState, useEffect } from "react";
import api from "../api";

export const useGoogleCalendar = (dogadjajId, onClose) => {
  const [loading, setLoading] = useState(false);
  const [showCalendarBtn, setShowCalendarBtn] = useState(true);

  useEffect(() => {
    const handleMessage = async (event) => {
      const backendUrl = window._env_?.BACKEND_URL || "http://localhost:8000";
      const backendOrigin = new URL(backendUrl).origin;

      if (event.origin !== backendOrigin) return;

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        const googleToken = event.data.token;
        try {
          setLoading(true);
          await api.post("/google/store-event", {
            dogadjaj_id: dogadjajId,
            token: googleToken,
          });
          alert("Događaj je uspešno dodat u vaš Google kalendar!");
          setShowCalendarBtn(false);
          onClose();
        } catch (err) {
          alert("Greška pri upisu u kalendar.");
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dogadjajId]);

  const addToCalendar = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/google/auth-url?dogadjaj_id=${dogadjajId}`);

      const width = 500,
        height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;

      window.open(
        res.data.url,
        "GoogleAuth",
        `width=${width},height=${height},top=${top},left=${left}`,
      );
    } catch (e) {
      console.error("Google Auth Error:", e.response?.data || e.message);
      alert(
        `Greška: ${e.response?.data?.detail || "Nije moguće dobiti Google Auth URL."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return { addToCalendar, loading, showCalendarBtn, setShowCalendarBtn };
};
