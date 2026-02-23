import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { privateCheck } from "../Services/backendServices";
import mapboxgl from 'mapbox-gl'; // Importación de la librería Mapbox
import 'mapbox-gl/dist/mapbox-gl.css'; // Estilos obligatorios de Mapbox
import { parking } from "../parking"; 
import '../index.css'; 

export const Private = () => {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true); // Estado de carga para seguridad
  const mapContainerRef = useRef(null); // Referencia al contenedor HTML del mapa
  const mapRef = useRef(null); // Referencia para guardar la instancia del mapa
  const markers = useRef([]); // Referencia para gestionar la lista de marcadores

  // --- FUNCIONES DE INTERACTIVIDAD ---

  // Función para desplazar la cámara del mapa a una ubicación
  const flyToParking = (p) => {
    mapRef.current.flyTo({
      center: p.geometry.coordinates, // Coordenadas del punto
      zoom: 15, // Nivel de zoom
      duration: 1000 // Duración de la animación
    });
  };

  // Función para coordinar la selección entre la lista y el mapa
  const selectParking = (p, index) => {
    // Quita la clase 'active' de cualquier item de la lista previamente seleccionado
    const activeItems = document.querySelectorAll('.store-item.active');
    activeItems.forEach((item) => item.classList.remove('active'));

    // Resalta el item actual en la lista lateral
    const selectedListing = document.getElementById(`listing-${index}`);
    if (selectedListing) {
      selectedListing.classList.add('active');
      selectedListing.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Quita la clase 'active' de cualquier marcador en el mapa previamente seleccionado
    const activeMarkers = document.querySelectorAll('.marker.active');
    activeMarkers.forEach((marker) => marker.classList.remove('active'));

    // Resalta el marcador visual en el mapa
    const selectedMarker = document.getElementById(`marker-${index}`);
    if (selectedMarker) {
      selectedMarker.classList.add('active');
    }

    // Mueve el mapa hacia el punto seleccionado
    flyToParking(p);
  };

  // Función para crear y colocar los marcadores en el mapa
  const addMarkers = () => {
    // Elimina marcadores existentes para evitar duplicados
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Recorre cada elemento de tu archivo parking.js
    parking.features.forEach((p, index) => {
      // CREACIÓN DEL ELEMENTO DOM (Tu marcador personalizado)
      const markerElement = document.createElement('div'); // Crea un div para el icono
      markerElement.id = `marker-${index}`; // Le asigna un ID único
      
      // Determina la categoría para aplicar estilos CSS
      const cat = p.properties.category || 'parking';
      markerElement.className = `marker ${cat}`; // Asigna clases (ej: "marker parking")

      // Lógica para insertar el icono de FontAwesome correspondiente
      let iconHTML = '';
      if (cat === 'parking') {
        iconHTML = '<i class="fa-solid fa-square-p"></i>';
      } else if (cat === 'camping') {
        iconHTML = '<i class="fa-solid fa-campground"></i>';
      } else {
        iconHTML = '<i class="fa-solid fa-location-dot"></i>';
      }

      markerElement.innerHTML = iconHTML; // Inserta el HTML del icono en el div
      
      // VINCULACIÓN CON LA API DE MAPBOX
      // 'element' es la propiedad de la API; 'markerElement' es nuestra variable
      const marker = new mapboxgl.Marker({ element: markerElement, anchor: 'bottom' })
        .setLngLat(p.geometry.coordinates) // Establece la posición geográfica
        .addTo(mapRef.current); // Añade el marcador al mapa

      markers.current.push(marker); // Guarda el marcador en la referencia

      // Escucha el evento click en el elemento visual
      markerElement.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el click se propague al mapa base
        selectParking(p, index);
      });
    });
  };

  // Función para generar la lista de ubicaciones en la barra lateral
  const buildLocationList = () => {
    const listings = document.getElementById('listings');
    const parkingCount = document.getElementById('parking-count');
    if (!listings || !parkingCount) return;

    // Actualiza el texto con el número total de parkings
    parkingCount.textContent = `Estacionamientos encontrados: ${parking.features.length}`;
    listings.innerHTML = ''; // Limpia la lista actual

    // Genera el HTML para cada parking en la lista
    parking.features.forEach((p, index) => {
      const listing = document.createElement('div');
      listing.id = `listing-${index}`;
      listing.className = 'store-item';
      // Se muestra:  solo Nombre, Dirección y Teléfono 
      listing.innerHTML = `
        <h4 class="store-name">${p.properties.name}</h4>
        <div class="store-details">
          <div><span class="label">Dirección: </span>${p.properties.address}</div>
          <div><span class="label">Teléfono: </span>${p.properties.phoneFormatted}</div>
        </div>
      `;

      // Escucha el click en el item de la lista
      listing.addEventListener('click', () => {
        selectParking(p, index);
      });

      listings.appendChild(listing);
    });
  };

  // --- EFECTOS (Lógica de inicio) ---

  // Efecto para verificar autenticación al cargar el componente
  useEffect(() => {
    const checkAuth = async () => {
      const response = await privateCheck();
      if (response) {
        setLoading(false); // Permite mostrar el mapa si el usuario es válido
      } else {
        localStorage.removeItem("token");
        navigate("/"); // Redirige si no hay token
      }
    };
    checkAuth();
  }, [navigate]);

  // Efecto para inicializar el mapa una vez verificada la autenticación
  useEffect(() => {
    if (!loading) {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current, // Referencia al div contenedor
        style: 'mapbox://styles/mapbox/streets-v12', // Estilo de mapa de calles
        center: [-3.70379, 40.41678], // Madrid como centro inicial
        zoom: 5 // Zoom inicial
      });

      mapRef.current = map; // Guarda la instancia para uso global

      // Cuando el mapa termine de cargar, inicializa datos y marcadores
      map.on('load', () => {
        map.addSource('places', { 'type': 'geojson', 'data': parking });
        addMarkers();
        buildLocationList();
      });

      return () => map.remove(); // Limpieza al desmontar el componente
    }
  }, [loading]);

  // Pantalla de carga mientras se verifica el token
  if (loading) return <div className="spinner-border"></div>;

  // Renderizado del componente
  return (
    <div className="store-locator-wrapper">
      <div className="sidebar">
        <div className="heading">
          <h2 id="parking-count" className="sidebar-title">Parkings cercanos: 0</h2>
        </div>
        <div id="listings" className="listings"></div>
      </div>
      <div ref={mapContainerRef} className="map"></div>
    </div>
  );
};