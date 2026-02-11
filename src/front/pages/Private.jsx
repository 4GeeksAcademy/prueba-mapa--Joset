import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { privateCheck } from "../Services/backendServices"

export const Private = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    const checkToken = async () => {
        const response = await privateCheck()
        console.log(response);
        if(response) {
            setUser(response)
            setLoading(false)
        }
        else{
            localStorage.removeItem("token")
            navigate("/")
        }
    }

console.log(user);
    

    //comprobar si el token no existe navega a home. Y si existe 
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/")
        } else {
            if (checkToken){
                setLoading(false)
                setUser(checkToken)
            }
        }
    }, [])
    return (
        <>
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>):(
                <h1>Esto hay que cambiarlo</h1>
            )}
        </>
    )
}


//falta: si user no registrado dar la opcion de registrarse
//en pagina private debe de tener algo distinto a un hola. Que queremos mostrar cuando el equipo se loguee