'use client'
import { CreateReportButton, GreenButton, PetCard } from "@/ui/cards";
import { useState } from "react";


export function AllMyReports(){
  const [showCard, setShowCard] = useState(false);

    const handleCreateReport = () => {
    setShowCard(true); // Mostrar la PetCard y ocultar el botón
  };

  return(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start",  width: "100vw", alignItems: "center", padding: 0, margin: 0, height: "100vh", backgroundColor: "#111" }}>
      {!showCard && (
        <CreateReportButton onClick={handleCreateReport}>
          🐾 Crear Reporte
        </CreateReportButton>
      )}
      {showCard && (
        <PetCard></PetCard>
      )}
    </div>
  )
}