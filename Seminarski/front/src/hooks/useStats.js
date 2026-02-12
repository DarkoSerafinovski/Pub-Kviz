import { useState } from "react";
import api from "../api";

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/timovi/statistika");
      setStats(res.data.data);
    } catch (err) {
      console.error("Greška pri učitavanju statistike:", err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, fetchStats };
};
