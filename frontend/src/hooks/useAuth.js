import { useNavigate } from "react-router-dom";
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/";

const useAuth = () => {
  const navigate = useNavigate();

  const login = async (username, password) => {
    let url = `${API_BASE_URL}auth/login/`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(
        "Invalid credentials. Please check username and/or password."
      );
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    navigate("/equipment");
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getToken()}`,
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isAuthenticated = () => !!localStorage.getItem("token");

  const getToken = () => localStorage.getItem("token");

  return { login, logout, isAuthenticated, getToken };
};

export default useAuth;
