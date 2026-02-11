import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { login } from "../Services/backendServices.js";
import { useNavigate } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer() //Creamos el useState para almacenar la data del usuario
	const navigate = useNavigate()

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
		// Usamos await para obtener respuesta del backend
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
	}, []);

	// ------------------- JSX -------------------
	return (
		<div className="container mt-5">
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">Email</label>
					<input type="text"
						name="email"
						placeholder="Enter your email"
						className="form-control"
						value={user.email}
						onChange={handleChange} />
				</div>
				<div className="mb-3">
					<label htmlFor="password" className="form-label">Password</label>
					<input
						type="text"
						name="password"
						placeholder="Enter your password"
						className="form-control"
						value={user.password}
						onChange={handleChange} />
				</div>
				<button type="submit" className="btn btn-primary w-100">Login</button>
			</form>

			{/* ------------------- MENSAJE DE USUARIO NO REGISTRADO ------------------- */}
			{userNotFound && (
				<div className="mt-3 text-center">
					<p> Este usuario no está registrado. ¿Quieres registrarte?</p>
					<button
						className="btn btn-secondary"
						onClick={() => navigate("/register")}
					>
						Registrarse
					</button>
				</div>
			)}

		</div>
	);
};


//NOTAS: 
// VALUE: conexion de input mas estado ejemplo:  value={user.email}.. Despues del usestate
// ONCHANGE: almacenar lo que el usuario escribe. Declarar funcion handleChange
//onSubmit / crear la const handleSubmit. Lo primero sera prevenir el comportamiento por defecto: preventdefault