//Creamos services en frontend porque necesitamos hacer peticiones al backend para conseguis datos del usuario
//Declaramos la funcion asincrona que se encarga de loguear al usuario

export const login = async (user, navigate) => {
    //buscamos la url que almacenamos del backend en el archivo .env + login de usuario/api/login
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",                 //+ metodo post 
        body: JSON.stringify(user),      // + body(donde se consiguen los datos de usuario ej: data, user, etc)
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()
    if (!response.ok) {
        alert(data.msg) //si la respuesta no es exitosa se genera la alerta
        return data;
    }
    localStorage.setItem("token", data.token)
    navigate("/private")
};

export const privateCheck = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, { //conecta con el endpoint GET profile de Backend para comprobar el token
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    },
    );

    const data = await response.json();
    if (!response.ok){
        return false;
    }
    return data;
};

export const register = async (user, navigate) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })

    const data = await response.json()

    if (!response.ok) {
        alert(data.msg)
        return data
    }

    navigate("/", { state: { msg: "Usuario creado satisfactoriamente" } }) // Redirige al login (Home)
}


