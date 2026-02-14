import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../Services/backendServices"
import rigoImageUrl from "../assets/img/rigo-baby.jpg" // Asegúrate de tener la imagen
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const Signup = () => {
    const navigate = useNavigate()


    const { store, dispatch } = useGlobalReducer()

    // ------------------- Estados -------------------
    const [user, setUser] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log("Estos son los datos de User:", user); //Hacer el console.log asi muestra directamente los cambios

    }, [user])

    // ------------------- Funciones -------------------
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user.email || !user.password || !user.confirmPassword) {
            alert("Todos los campos son obligatorios")
            return
        }

        if (user.password !== user.confirmPassword) {
            alert("Las contraseñas no coinciden")
            return
        }

        setLoading(true)

        await register({
            email: user.email,
            password: user.password
        }, navigate("/"))

        setLoading(false)
    }

    // ------------------- VISUAL-------------------
    return (
        <div className="auth-page">
            <div className="auth-container">

                <img src={rigoImageUrl} alt="RigoBot" className="auth-avatar" />

                <h2 className="fw-bold mb-3">Register</h2>
                <p className="text-light opacity-75 mb-4">Create your account to continue</p>

                <form onSubmit={handleSubmit} className="text-start">
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="form-control"
                            //cuando se hace un handleChange debemos acompañar el input con:
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="form-control"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            className="form-control"
                            name="confirmPassword"
                            value={user.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        {loading ? "Creando..." : "Registrarse"}
                    </button>
                </form>
            </div>
        </div>
    )
}

