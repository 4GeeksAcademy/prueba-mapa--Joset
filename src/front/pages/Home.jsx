import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { login } from "../Services/backendServices.js";
import { useLocation, useNavigate } from "react-router-dom";
import '../index.css';

export const Home = () => {

  const { store, dispatch } = useGlobalReducer()
  const navigate = useNavigate()
  const location = useLocation();
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState(null);
  const [userNotFound, setUserNotFound] = useState(false); // <- Estado añadido para mostrar registro


  // ------------------- ESTADOS -------------------
  const [user, setUser] = useState({ //Creamos el useState para almacenar la data del usuario
    email: "",
    password: ""
  })

  // ------------------- FUNCIONES -------------------
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value //Actualizamos en el estado user la propiedad del input
    });
    setUserNotFound(false); // <- Oculta el mensaje si empieza a escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError(null);
    setUserNotFound(false);

    if (!user.email || !user.password) {
      setError("All fields are required");
      return;
    }
    // Usamos await para esperar respuesta del backend
      const response = await login(user);

  if (response?.error) {
    if (response.msg === "Invalid email or password") {
      setUserNotFound(true);
    } else {
      setError(response.msg);
    }
    return;
  }

  navigate("/private");
  };


  // ------------------- Esto venia por defecto..Funciona ?  -------------------
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


        <h2 className="fw-bold">Welcome</h2>
        <p className="text-light opacity-75 mb-4">
          Sign in to continue
        </p>
        {error && (
  <div className="alert alert-warning text-center">
    {error}
  </div>
)}

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