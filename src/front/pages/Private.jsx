import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { privateCheck } from "../Services/backendServices";
import bgImage from "../assets/img/Gemini_Generated_Image_30n2lw30n2lw30n2.png";

export const Private = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await privateCheck();
      if (response) {
        setUser(response);
        setLoading(false);
      } else {
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <img 
  src={bgImage} 
  alt="Decorativa" 
  className="decorative-img" 
/>
    </div>
  );
};


//falta: si user no registrado dar la opcion de registrarse
//en pagina private debe de tener algo distinto a un hola. Que queremos mostrar cuando el equipo se loguee