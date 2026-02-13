import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { login } from "../Services/backendServices.js";
import { useLocation, useNavigate } from "react-router-dom";
import '../index.css';

export const Home = () => {

  const { store, dispatch } = useGlobalReducer() //Creamos el useState para almacenar la data del usuario
  const navigate = useNavigate()
  const location = useLocation();
  const [successMsg, setSuccessMsg] = useState("");

  // ------------------- ESTADOS -------------------
  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const [userNotFound, setUserNotFound] = useState(false); // <- Estado añadido para mostrar registro

  // ------------------- FUNCIONES -------------------
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
    setUserNotFound(false); // <- Oculta el mensaje si empieza a escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user.email || !user.password) {
      alert("All fields are required");
      return;
    }
    // Usamos await para esperar respuesta del backend
    const response = await login(user, navigate);
    if (response?.msg === "Invalid email or password") {
      setUserNotFound(true); // <- activa el mensaje de registrarse
    }
  };


  // ------------------- CARGA MENSAJE -------------------
  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

      const response = await fetch(backendUrl + "/api/hello")
      const data = await response.json()

      if (response.ok) dispatch({ type: "set_hello", payload: data.message })

      return data
    } catch (error) {
      if (error.message) throw new Error(
        `Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
      );
    }
  };

  // ------------------- USE EFFECT -------------------
  useEffect(() => {
    loadMessage()
    // Si llegamos desde Signup, location.state.msg tendrá el mensaje
    if (location.state?.msg) {
      setSuccessMsg(location.state.msg);
      // Limpia el state para que no aparezca de nuevo al refrescar
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // ------------------- JSX -------------------
  return (
    <div className="auth-page">
      <div className="auth-container">
        <img src={rigoImageUrl} alt="RigoBot" className="auth-avatar" />
        {successMsg && (
          <div className="alert alert-success text-center">
            {successMsg}
          </div>
        )}


        <h2 className="fw-bold">Welcome Back</h2>
        <p className="text-light opacity-75 mb-4">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-3">
            <label className="form-label small opacity-75">Email</label>
            <input
              type="email"
              name="email"
              className="form-control rounded-3 py-2"
              placeholder="example@email.com"
              value={user.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label small opacity-75">Password</label>
            <input
              type="password"
              name="password"
              className="form-control rounded-3 py-2"
              placeholder="••••••••"
              value={user.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 py-2 rounded-3 fw-semibold"
          >
            Login
          </button>
        </form>

        {userNotFound && (
          <div className="text-center mt-4">
            <p className="text-warning small">
              This user is not registered.
            </p>
            <button
              className="btn btn-outline-light btn-sm rounded-3"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  );



};


//NOTAS: 
// VALUE: conexion de input mas estado ejemplo:  value={user.email}.. Despues del usestate
// ONCHANGE: almacenar lo que el usuario escribe. Declarar funcion handleChange
//onSubmit / crear la const handleSubmit. Lo primero sera prevenir el comportamiento por defecto: preventdefault