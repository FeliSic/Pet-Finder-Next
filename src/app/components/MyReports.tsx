"use client";
import { CreateReportButton, PetCard } from "@/ui/cards";
import { useState, useEffect } from "react";
import { geocodeAddress, reverseGeocode } from "../../../lib/geocoding";
import MapPickerWrap from "./MapPickerWrapper";

export function AllMyReports() {
  const [showCard, setShowCard] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lastSeen: "",
    image: null as File | null,
  });

  // Cargar reportes al montar el componente
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch("/api/pets/myReports", {
        headers: { userId: userId! },
      });
      const text = await res.text(); // Obtén el texto bruto
      console.log("Respuesta:", text); // Míralo en la consola
      const result = JSON.parse(text);
      if (result.success) {
        const reportsWithDays = result.pets.map((report: any) => {
          const createdAt = new Date(report.createdAt);
          const now = new Date();
          const diffTime =
            createdAt.getTime() + 30 * 24 * 60 * 60 * 1000 - now.getTime();
          const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return { ...report, daysRemaining };
        });
        setReports(reportsWithDays);
      } else {
        console.error("Error del servidor:", result.error);
      }
    } catch (error) {
      console.error("Error al parsear JSON:", error);
    }
  };

  const handleNewReport = () => {
    setShowCard(true);
    setSelectedCoords(null);
    setFormData((prev) => ({ ...prev, lastSeen: "" })); // resetear dirección
  };

  // Cuando se selecciona ubicación en el mapa
  const handleLocationSelect = async (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    // Geocodificación inversa para obtener la dirección
    const address = await reverseGeocode(lat, lng);
    if (address) {
      setFormData((prev) => ({ ...prev, lastSeen: address }));
    }
  };

  // Cuando el usuario escribe manualmente la dirección
  const handleLastSeenChange = async (val: string) => {
    setFormData((prev) => ({ ...prev, lastSeen: val }));
    if (val.trim() !== "") {
      const coords = await geocodeAddress(val);
      if (coords) {
        // Convertimos a formato { lat, lng }
        setSelectedCoords({ lat: coords.latitude, lng: coords.longitude });
      } else {
        // Si no se encuentra, quizás limpiar coordenadas?
        setSelectedCoords(null);
      }
    }
  };

  const handleCreateReport = async () => {
    if (!selectedCoords) {
      alert(
        "Por favor selecciona una ubicación válida en el mapa o ingresa una dirección válida.",
      );
      return;
    }

    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");

    const data = new FormData();
    data.append("userId", userId!);
    data.append("userEmail", userEmail!);
    data.append("lastSeen", formData.lastSeen);
    data.append("petStatus", "pending");
    data.append("name", formData.name);
    data.append("description", formData.description);

    if (formData.image) data.append("image", formData.image);

    // Enviamos coordenadas al backend
    data.append("latitude", selectedCoords.lat.toString());
    data.append("longitude", selectedCoords.lng.toString());

    const res = await fetch("/api/pets/CreateReport", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    if (result.success) {
      setShowCard(false);
      setFormData({ name: "", description: "", lastSeen: "", image: null });
      fetchReports(); // recargar la lista
    } else {
      alert("Error creando reporte: " + result.error);
    }
  };

  const handleRenewReport = async (reportId: string) => {
    const userId = localStorage.getItem("userId");
    const res = await fetch("/api/cron/renew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, userId }),
    });
    const result = await res.json();
    if (result.success) {
      // Recargar la lista para actualizar días restantes
      fetchReports();
    } else {
      alert("Error al renovar: " + result.error);
    }
  };

  const handleCompleteReport = async (reportId: string) => {
    const userId = localStorage.getItem("userId"); // 👈 obtén el userId

    const res = await fetch("/api/cron/complete", {
      // 👈 asegúrate que la ruta sea correcta
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, userId }), // 👈 ahora sí envías ambos
    });
    const result = await res.json();
    if (result.success) {
      fetchReports(); // recargar la lista
    } else {
      alert("Error al marcar como completado: " + result.error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        width: "100vw",
        alignItems: "center",
        padding: 0,
        margin: 0,
        minHeight: "100vh",
        backgroundColor: "#111",
      }}
    >
      {/* Lista de reportes existentes */}
      {reports.map((report) => (
        <PetCard
          key={report.id}
          name={report.name}
          description={report.description}
          src={report.imageUrl}
          LabelDesc={report.lastSeen}
          daysRemaining={report.daysRemaining}
          onRenew={handleRenewReport}
          reportId={report.id}
          onComplete={handleCompleteReport}
        />
      ))}

      {/* Formulario de nuevo reporte */}
      {showCard && (
        <PetCard
          isEditing={true}
          src={
            formData.image
              ? URL.createObjectURL(formData.image)
              : "ejemploPet.jpg"
          }
          name={formData.name}
          description={formData.description}
          LabelDesc={formData.lastSeen} // ← cambio aquí
          onChangeName={(val) =>
            setFormData((prev) => ({ ...prev, name: val }))
          }
          onChangeDescription={(val) =>
            setFormData((prev) => ({ ...prev, description: val }))
          }
          onChangeLastSeen={handleLastSeenChange} // maneja geocodificación
          onChangeImage={(file) =>
            setFormData((prev) => ({ ...prev, image: file }))
          }
          onSubmit={handleCreateReport}
          mapComponent={
            <MapPickerWrap
              onLocationSelect={handleLocationSelect}
              initialPosition={
                selectedCoords
                  ? [selectedCoords.lat, selectedCoords.lng]
                  : undefined
              }
            />
          }
        />
      )}

      {!showCard && (
        <CreateReportButton
          className="hover-scale2 hover-scale3"
          onClick={handleNewReport}
        >
          🐾 Crear Reporte
        </CreateReportButton>
      )}
    </div>
  );
}
