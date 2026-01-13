import { useState, useEffect, useCallback } from "react";
import api from "../api";

export const useDogadjaji = (sezonaId, initialFetchUrl) => {
  const [dogadjaji, setDogadjaji] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ naziv: "", omiljeni: false });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, naziv: searchTerm }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchDogadjaji = useCallback(async () => {
    setLoading(true);
    try {
      const baseRoute = initialFetchUrl || `/dogadjaji`;
      const response = await api.get(baseRoute, {
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
      console.error("Greška prilikom učitavanja:", error);
    } finally {
      setLoading(false);
    }
  }, [sezonaId, initialFetchUrl, filters, currentPage]);

  useEffect(() => {
    fetchDogadjaji();
  }, [fetchDogadjaji]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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
          d.id === dogadjajId ? { ...d, omiljeni: !isCurrentlyFavorite } : d
        )
      );
    } catch (error) {
      console.error("Greška sa favoritima:", error);
    }
  };

  return {
    dogadjaji,
    loading,
    paginationMeta,
    currentPage,
    setCurrentPage,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    toggleFavorite,
    refresh: fetchDogadjaji,
  };
};
