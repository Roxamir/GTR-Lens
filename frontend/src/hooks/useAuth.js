import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();

  const login = async (username, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
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

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isAuthenticated = () => !!localStorage.getItem("token");

  const getToken = () => localStorage.getItem("token");

  return { login, logout, isAuthenticated, getToken };
};

export default useAuth;
