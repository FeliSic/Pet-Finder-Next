'use client'
import { CreateReportButton, PetCard } from "@/ui/cards";
import { useState, useEffect } from "react";

export function AllMyReports() {
  const [showCard, setShowCard] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
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
    const res = await fetch('/api/pets/MyReports', {
      headers: { userId: userId! },
    });
    const result = await res.json();
    if (result.success) setReports(result.pets);
  };

  const handleNewReport = () => setShowCard(true);

  const handleCreateReport = async () => {
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
          lastSeen={report.lastSeen}
          LabelDesc={report.lastSeen}
        />
      ))}

      {/* Formulario de nuevo reporte */}
      {showCard && (
        <PetCard
          isEditing={true}
          src={formData.image ? URL.createObjectURL(formData.image) : "ejemploPet.jpg"}
          onChangeName={(val) => setFormData(prev => ({ ...prev, name: val }))}
          onChangeDescription={(val) => setFormData(prev => ({ ...prev, description: val }))}
          onChangeLastSeen={(val) => setFormData(prev => ({ ...prev, lastSeen: val }))}
          onChangeImage={(file) => setFormData(prev => ({ ...prev, image: file }))}
          onSubmit={handleCreateReport}
        />
      )}

      {/* Botón siempre al final */}
      {!showCard && (
        <CreateReportButton onClick={handleNewReport}>
          🐾 Crear Reporte
        </CreateReportButton>
      )}
    </div>
  );
}