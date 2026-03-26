'use client'
import { CreateReportButton, PetCard } from "@/ui/cards";
import { useState, useEffect } from "react";
import { geocodeAddress, reverseGeocode } from "../../../lib/geocoding";
import MapPickerWrap from "./MapPickerWrapper";

export function AllMyReports() {
  const [showCard, setShowCard] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lastSeen: '',
    image: null as File | null,
  });

  // Cargar reportes al montar el componente
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    console.log('userId', userId, 'userEmail', userEmail);
    const res = await fetch('/api/pets/MyReports', {
      headers: { userId: userId! },
    });
    const result = await res.json();
    if (result.success) setReports(result.pets);
  };

    const handleNewReport = () => {
    setShowCard(true);
    setSelectedCoords(null);
    setFormData(prev => ({ ...prev, lastSeen: '' })); // resetear dirección
    };

     // Cuando se selecciona ubicación en el mapa
    const handleLocationSelect = async (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    // Geocodificación inversa para obtener la dirección
    const address = await reverseGeocode(lat, lng);
    if (address) {
      setFormData(prev => ({ ...prev, lastSeen: address }));
      }
    };

      // Cuando el usuario escribe manualmente la dirección
    const handleLastSeenChange = async (val: string) => {
    setFormData(prev => ({ ...prev, lastSeen: val }));
    if (val.trim() !== '') {
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
        alert('Por favor selecciona una ubicación válida en el mapa o ingresa una dirección válida.');
      return;
      }

    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    

    const data = new FormData();
    data.append('userId', userId!);
    data.append('userEmail', userEmail!);
    data.append('lastSeen', formData.lastSeen);
    data.append('petStatus', 'pending');
    data.append('name', formData.name);
    data.append('description', formData.description);

    if (formData.image) data.append('image', formData.image);

    // Enviamos coordenadas al backend
    data.append('latitude', selectedCoords.lat.toString());
    data.append('longitude', selectedCoords.lng.toString());


    const res = await fetch('/api/pets/CreateReport', {
      method: 'POST',
      body: data,
    });

    const result = await res.json();
    if (result.success) {
      setShowCard(false);
      setFormData({ name: '', description: '', lastSeen: '', image: null });
      fetchReports(); // recargar la lista
    } else {
      alert('Error creando reporte: ' + result.error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", width: "100vw", alignItems: "center", padding: 0, margin: 0, minHeight: "100vh", backgroundColor: "#111" }}>
      
      {/* Lista de reportes existentes */}
      {reports.map((report) => (
  <PetCard
    key={report.id}
    name={report.name}
    description={report.description}
    src={report.imageUrl}
    LabelDesc={report.lastSeen}
    onRenew={() => {
      // Aquí llamarás al endpoint de renovación
      console.log('Renovar reporte', report.id);
      alert('Función de renovación (próximamente)');
    }}
    onGiveNotice={() => {
      // Aquí llamarás al endpoint de completar (dar aviso de encontrado)
      console.log('Marcar como completado', report.id);
      alert('Reporte marcado como completado (próximamente)');
    }}
  />
    ))}

      {/* Formulario de nuevo reporte */}
      {showCard && (
    <PetCard
        isEditing={true}
        src={formData.image ? URL.createObjectURL(formData.image) : "ejemploPet.jpg"}
        name={formData.name}
        description={formData.description}
        LabelDesc={formData.lastSeen}               // ← cambio aquí
        onChangeName={(val) => setFormData(prev => ({ ...prev, name: val }))}
        onChangeDescription={(val) => setFormData(prev => ({ ...prev, description: val }))}
        onChangeLastSeen={handleLastSeenChange}     // maneja geocodificación
        onChangeImage={(file) => setFormData(prev => ({ ...prev, image: file }))}
        onSubmit={handleCreateReport}
        mapComponent={
      <MapPickerWrap
        onLocationSelect={handleLocationSelect}
        initialPosition={selectedCoords ? [selectedCoords.lat, selectedCoords.lng] : undefined}
      />
    }
    />
  )}

      {!showCard && (
        <CreateReportButton onClick={handleNewReport}>
          🐾 Crear Reporte
        </CreateReportButton>
      )}
    </div>
    );
  }