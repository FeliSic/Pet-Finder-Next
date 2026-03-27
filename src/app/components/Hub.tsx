'use client'
import { Body, Subtitle, TitleCentrado } from "@/ui/typography";
import styled from "styled-components";
import { BlueButton, YellowButton } from "@/ui/buttons";
import { SearcherForm } from "../../ui/form/index";
import { useState } from "react";
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

const SearcherButt = styled(BlueButton)`
  background-color: #A1E0FF;
  width: 347px;
  padding: 30px;
`
const WhatButt = styled(YellowButton)`
  background-color: #D9FFC2;
  width: 347px;
  padding: 30px;
`

export default function Hub({ query }: { query: string }) {
  const [Showinfo, setShowInfo] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Función para obtener reportes cercanos a unas coordenadas
  const fetchNearbyReports = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pets/nearby?lat=${lat}&lng=${lng}&radius=500`);
      const data = await res.json();
      if (data.success) {
        setReports(data.pets);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Ubicación de prueba (Buenos Aires)
  const useMockLocation = () => {
    const mockLat = -34.6037;
    const mockLng = -58.3816;
    setLocation({ lat: mockLat, lng: mockLng });
    fetchNearbyReports(mockLat, mockLng);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización. Usando ubicación de prueba.");
      useMockLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        await fetchNearbyReports(latitude, longitude);
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        alert("No se pudo obtener tu ubicación. Usando ubicación de prueba.");
        useMockLocation();
      }
    );
  };

  const handleShowInfo = () => {
    setShowInfo(prev => !prev);
  };

  // Si ya tenemos ubicación, mostramos el mapa
  if (location) {
    return (
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        {loading && <div style={{ position: "absolute", top: "50%", left: "50%", zIndex: 1000 }}>Cargando reportes cercanos...</div>}
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Circle
            center={[location.lat, location.lng]}
            radius={500}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
          />
          <Marker position={[location.lat, location.lng]}>
            <Popup>Tu ubicación</Popup>
          </Marker>
          {reports.map((report) => (
            <Marker key={report.id} position={[report.latitude, report.longitude]}>
              <Popup>
                <strong>{report.name}</strong><br />
                {report.description}<br />
                Última vez: {report.lastSeen}<br />
                <img src={report.imageUrl} alt={report.name} style={{ width: "100px" }} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <button
          onClick={() => setLocation(null)}
          style={{ position: "absolute", top: 20, right: 20, zIndex: 1000, padding: "10px", background: "#fff", borderRadius: "5px" }}
        >
          Volver
        </button>
      </div>
    );
  }

  // Vista inicial con botones
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100vw", alignItems: "center", padding: 0, margin: 0, height: "100vh", backgroundColor: "#111" }}>
      <SearcherForm>
        { !Showinfo ? (
          <>
            <TitleCentrado>El mejor Pet-finder del mundo</TitleCentrado>
            <SearcherButt onClick={handleGeolocation}>Iniciar Geolocalización</SearcherButt>
            <WhatButt onClick={handleShowInfo}>¿Que es Pet Finder?</WhatButt>
          </>
        ) : (
          <>
            <Subtitle>¿Como funciona?</Subtitle>
            <Body style={{textAlign: "center"}}>
              A través de la geolocalización basada en una fórmula matemática para calcular la ubicación del usuario, en un radio aproximado de 100mts se podrá escanear si hay algún reporte hecho por tu zona, para que puedas estar atento de encontrar a la mascota de otro dueño y viceversa
            </Body>
            <WhatButt onClick={handleShowInfo}>Volver</WhatButt>
          </>
        )}
      </SearcherForm>
    </div>
  );
}


export const LogInForm = styled.form`
    display: flex;
    width: 400px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background-color: #000;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;