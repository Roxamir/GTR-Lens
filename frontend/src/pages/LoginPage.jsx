import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../components/ui/LoginCard";
import { validateCredentials } from "../utils/validators";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);

  const correctUN = "test";
  const correctPW = "password";

  const handleLogin = (event) => {
    event.preventDefault();
    const newErrors = {};
    const result = validateCredentials(
      correctUN,
      correctPW,
      username,
      password
    );
    // check username
    if (!username) {
      newErrors.username = "Please enter a username.";
    }

    if (!password) {
      newErrors.password = "Please enter a password.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; //stop submission
    }

    if (result) {
      console.log("Correct!");
      setErrors({});
      setLoginError(null);
      navigate("/equipment");
    } else {
      console.log("Try again!");
      setLoginError("Incorrect credentials. Please fix and try again.");
      setPassword("");
      return;
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
