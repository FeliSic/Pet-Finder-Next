"use client";
import { Body, Subtitle, TitleCentrado } from "@/ui/typography";
import styled from "styled-components";
import { BlueButton, YellowButton } from "@/ui/buttons";
import { SearcherForm } from "../../ui/form/index";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Importar L dinámicamente solo en cliente
let L: any;
if (typeof window !== "undefined") {
  L = require("leaflet");
}

// Componentes del mapa (import dinámico sin SSR)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
);

const SearcherButt = styled(BlueButton)`
  background-color: #a1e0ff;
  width: 347px;
  padding: 30px;
`;
const WhatButt = styled(YellowButton)`
  background-color: #d9ffc2;
  width: 347px;
  padding: 30px;
`;

export default function Hub({ query }: { query: string }) {
  const [showInfo, setShowInfo] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [userIcon, setUserIcon] = useState<any>(null);
  const [petIcon, setPetIcon] = useState<any>(null);

  // Crear íconos personalizados solo en el cliente
  useEffect(() => {
    if (typeof window !== "undefined" && L) {
      setUserIcon(
        L.divIcon({
          html: "📍",
          iconSize: [36, 36],
          className: "custom-div-icon",
        }),
      );
      setPetIcon(
        L.divIcon({
          html: "🐾",
          iconSize: [36, 36],
          className: "custom-div-icon",
        }),
      );
    }
  }, []);

  // Obtener reportes cercanos a una ubicación
  const fetchNearbyReports = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/pets/nearby?lat=${lat}&lng=${lng}&radius=500`,
      );
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
    updateLocation(mockLat, mockLng).catch((err) =>
      console.error("Error guardando ubicación mock:", err),
    );
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Tu navegador no soporta geolocalización. Usando ubicación de prueba.",
      );
      useMockLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        await fetchNearbyReports(latitude, longitude);
        // Guardar ubicación para notificaciones pasivas
        await updateLocation(latitude, longitude).catch((err) =>
          console.error("Error guardando ubicación:", err),
        );
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        alert("No se pudo obtener tu ubicación. Usando ubicación de prueba.");
        useMockLocation();
      },
    );
  };

  const handleShowInfo = () => {
    setShowInfo((prev) => !prev);
  };

  const openNotifyModal = (report: any) => {
    setSelectedReport(report);
    setShowNotifyModal(true);
  };

  const sendAviso = async () => {
    if (!message.trim()) {
      alert("Escribe un mensaje antes de enviar");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Debes iniciar sesión para enviar un aviso");
      return;
    }

    try {
      const res = await fetch("/api/emails/found-pet-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userId: userId,
        },
        body: JSON.stringify({
          reportId: selectedReport.id,
          message: message.trim(),
        }),
      });

      if (res.ok) {
        alert(
          "Aviso enviado. El dueño recibirá tu mensaje y tus datos de contacto.",
        );
        setShowNotifyModal(false);
        setMessage("");
      } else {
        const error = await res.json();
        alert("Error al enviar aviso: " + (error.error || "Intenta de nuevo"));
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  const updateLocation = async (lat: number, lng: number) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    await fetch("/api/me/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, latitude: lat, longitude: lng }),
    });
  };

  // Si ya tenemos ubicación, mostrar el mapa
  if (location) {
    return (
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              zIndex: 1000,
            }}
          >
            Cargando reportes cercanos...
          </div>
        )}
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
            pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }}
          />
          {/* Marcador del usuario */}
          {userIcon && (
            <Marker position={[location.lat, location.lng]} icon={userIcon}>
              <Popup>Tu ubicación</Popup>
            </Marker>
          )}
          {/* Marcadores de reportes */}
          {reports.map(
            (report) =>
              petIcon && (
                <Marker
                  key={report.id}
                  position={[report.latitude, report.longitude]}
                  icon={petIcon}
                >
                  <Popup>
                    <strong>{report.name}</strong>
                    <br />
                    {report.description}
                    <br />
                    Última vez: {report.lastSeen}
                    <br />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "8px",
                      }}
                    >
                      <img
                        src={report.imageUrl}
                        alt={report.name}
                        style={{ width: "80px", borderRadius: "4px" }}
                      />
                      <button
                        className="hover-scale2"
                        onClick={() => openNotifyModal(report)}
                        style={{
                          padding: "6px 12px",
                          background: "#4CAF50",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Dar aviso
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ),
          )}
        </MapContainer>

        {/* Botón para volver al inicio */}
        <button
          className="hover-scale2"
          onClick={() => setLocation(null)}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 1000,
            padding: "10px",
            background: "#fff",
            borderRadius: "5px",
          }}
        >
          Volver
        </button>

        {/* Modal de aviso */}
        {showNotifyModal && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              zIndex: 1000,
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              minWidth: "300px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h4 style={{ margin: 0, color: "#000" }}>
                Daras aviso al dueño, con tu email, teléfono y el mensaje de
                abajo
              </h4>
              <button
                className="hover-scale"
                onClick={() => setShowNotifyModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Ejemplo: Vi a tu perro en la plaza, estaba con collar rojo."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                margin: "10px 0",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button
              className="hover-scale2"
              onClick={sendAviso}
              style={{
                width: "100%",
                padding: "10px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Enviar aviso
            </button>
          </div>
        )}
      </div>
    );
  }

  // Vista inicial (antes de la geolocalización)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100vw",
        alignItems: "center",
        padding: 0,
        margin: 0,
        height: "100vh",
        backgroundColor: "#111",
      }}
    >
      <SearcherForm className="hover-scale2 hover-scale3">
        {!showInfo ? (
          <>
            <TitleCentrado>El mejor Pet-finder del mundo</TitleCentrado>
            <SearcherButt className="hover-scale2" onClick={handleGeolocation}>
              Iniciar Geolocalización
            </SearcherButt>
            <WhatButt className="hover-scale2" onClick={handleShowInfo}>
              ¿Que es Pet Finder?
            </WhatButt>
          </>
        ) : (
          <>
            <Subtitle>¿Como funciona?</Subtitle>
            <Body style={{ textAlign: "center" }}>
              A través de la geolocalización basada en una fórmula matemática
              para calcular la ubicación del usuario, en un radio aproximado de
              100mts se podrá escanear si hay algún reporte hecho por tu zona,
              para que puedas estar atento de encontrar a la mascota de otro
              dueño y viceversa
            </Body>
            <WhatButt className="hover-scale2" onClick={handleShowInfo}>
              Volver
            </WhatButt>
          </>
        )}
      </SearcherForm>
    </div>
  );
}

// export const LogInForm = styled.form`
//     display: flex;
//     width: 400px;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     gap: 1rem;
//     background-color: #000;
//     padding: 2rem;
//     border-radius: 8px;
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// `;
