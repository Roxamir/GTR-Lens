import { useState } from "react";
import LoginCard from "../components/ui/LoginCard";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoginError("");

    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    // If there are validation errors, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(username, password);
    } catch (error) {
      setLoginError(error.message);
      setPassword("");
    }
  };

  return (
    <LoginCard
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      errors={errors}
      loginError={loginError}
      onSubmit={handleLogin}
    />
  );
};

export default LoginPage;
