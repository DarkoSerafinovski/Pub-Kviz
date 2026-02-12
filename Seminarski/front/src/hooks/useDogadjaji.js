import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export const useDogadjaji = (sezonaId) => {
  const [dogadjaji, setDogadjaji] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ naziv: "", omiljeni: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [podaci, setPodaci] = useState([]);
  const [naslovDogadjaja, setNaslovDogadjaja] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({ naziv: searchTerm });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const fetchDogadjaji = async (initialFetchUrl) => {
    setLoading(true);
    try {
      const response = await api.get(initialFetchUrl, {
        params: {
          sezona_id: sezonaId,
          naziv: filters.naziv,
          omiljeni: filters.omiljeni ? 1 : 0,
          page: currentPage,
        },
      });
      setDogadjaji(response.data.data);
      setPaginationMeta(response.data.meta);
    } catch (error) {
      console.error("Greska prilikom ucitavanja:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (dogadjajId, isCurrentlyFavorite) => {
    try {
      if (isCurrentlyFavorite) {
        await api.delete(`/users/dogadjaji/ukloni-iz-omiljenih/${dogadjajId}`);
      } else {
        await api.post(`/users/dogadjaji/dodaj-u-omiljene`, {
          dogadjaj_id: dogadjajId,
        });
      }

      setDogadjaji((prev) =>
        prev.map((d) =>
          d.id === dogadjajId ? { ...d, omiljeni: !isCurrentlyFavorite } : d,
        ),
      );
    } catch (error) {
      console.error("Greška sa favoritima:", error);
    }
  };

  const createDogadjaj = async (formData, periodText) => {
    setLoading(true);
    setError("");

    try {
      await api.post("/dogadjaji", formData);
      navigate(`/sezone/${sezonaId}/dogadjaji`, {
        state: { period: periodText },
      });
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError(
          err.response?.data?.message ||
            "Došlo je do greške. Pokušajte ponovo.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRangLista = async (dogadjajId) => {
    setLoading(true);
    try {
      const response = await api.get(`/dogadjaji/${dogadjajId}/rang`);
      setPodaci(response.data.data);
      const poruka = response.data.message;
      const naziv = poruka.match(/"([^"]+)"/)?.[1] || "Rezultati Kola";
      setNaslovDogadjaja(naziv);
    } catch (error) {
      console.error("Greška pri učitavanju:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateScore = async (timId, dogadjajId, noviScore) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("tim_id", Number(timId));
      formData.append("dogadjaj_id", Number(dogadjajId));
      formData.append("score", Number(noviScore));
      formData.append("_method", "PUT");

      await api.post("/timovi/dogadjaj/azuriraj-rezultat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.errors
        ? Object.values(err.response.data.errors)[0][0]
        : "Greška pri ažuriranju rezultata.";

      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    dogadjaji,
    loading,
    paginationMeta,
    currentPage,
    setCurrentPage,
    filters,
    updateFilters,
    searchTerm,
    podaci,
    naslovDogadjaja,
    setSearchTerm,
    toggleFavorite,
    fetchDogadjaji,
    createDogadjaj,
    fetchRangLista,
    updateScore,
  };
};
