import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Spinner from "../Spinner";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8081/verify-token",
          { token }
        );
        if (response.data.valid) {
          setIsValid(true);
        } else {
          Cookies.remove("token");
          setIsValid(false);
          navigate("/login");
        }
      } catch {
        Cookies.remove("token");
        setIsValid(false);
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate, token]);

  if (isValid === null) {
    return <Spinner />;
  }

  return isValid ? children : null;
};

export default ProtectedRoute;
