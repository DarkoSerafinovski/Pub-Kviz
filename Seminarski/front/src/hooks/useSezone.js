import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export const useSezone = () => {
  const [sezone, setSezone] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ pocetak: "", kraj: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const navigate = useNavigate();

  const [podaci, setPodaci] = useState([]);
  const [sezonaInfo, setSezonaInfo] = useState("");

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const fetchSezone = async () => {
    setLoading(true);
    try {
      const response = await api.get("/sezone", {
        params: {
          ...filters,
          page: currentPage,
        },
      });
      setSezone(response.data.data);
      setPaginationMeta(response.data.meta);
    } catch (error) {
      console.error("Greška pri učitavanju sezona:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSezona = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await api.post("/sezone", formData);
      navigate("/sezone");
    } catch (err) {
      if (err.response?.status === 422) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError("Došlo je do greške prilikom kreiranja sezone.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRangLista = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/sezone/${id}/rang`);
      setPodaci(response.data.data);
      setSezonaInfo(response.data.sezona);
    } catch (error) {
      console.error("Greška pri učitavanju rang liste:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    sezone,
    loading,
    error,
    filters,
    updateFilters,
    currentPage,
    setCurrentPage,
    paginationMeta,
    podaci,
    sezonaInfo,
    fetchSezone,
    createSezona,
    fetchRangLista,
  };
};
