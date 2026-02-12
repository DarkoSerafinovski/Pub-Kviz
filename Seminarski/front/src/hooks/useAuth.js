import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const saveUserData = (result) => {
    localStorage.setItem("token", result.access_token);
    localStorage.setItem("role", result.data.role);
    localStorage.setItem("username", result.data.username);
    if (result.tim_id) {
      localStorage.setItem("tim_id", result.tim_id);
    }
  };

  const login = async (email, password, credentials = null) => {
    setLoading(true);
    setError("");

    const loginData = credentials || { email, password };

    try {
      const response = await api.post("/login", loginData);
      saveUserData(response.data);
      navigate("/sezone");
    } catch (err) {
      console.error("Login Error:", err);
      const message =
        err.response?.data?.message ||
        "Neispravni kredencijali ili greška sa serverom.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formDataObj, logoFile) => {
    setLoading(true);
    setError("");

    const data = new FormData();
    Object.keys(formDataObj).forEach((key) => {
      data.append(key, formDataObj[key]);
    });
    if (logoFile) data.append("logo", logoFile);

    try {
      const response = await api.post("/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        saveUserData(response.data);
        navigate("/sezone");
      }
    } catch (err) {
      const serverError = err.response?.data?.errors
        ? Object.values(err.response.data.errors)[0][0]
        : "Greška prilikom registracije.";
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Greška na serveru prilikom odjavljivanja:", error);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const loggedTimId = localStorage.getItem("tim_id");

  return {
    login,
    register,
    logout,
    loading,
    error,
    setError,
    role,
    username,
    loggedTimId,
  };
};
