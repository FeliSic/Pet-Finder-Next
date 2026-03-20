'use client'
import { Body, Subtitle, TitleCentrado } from "@/ui/typography";
import { Input } from "@/ui/text-field";
import styled from "styled-components";
import { BlueButton, YellowButton } from "@/ui/buttons";
import { SearcherForm } from "../../ui/form/index";
import { useState } from "react";
import {useRouter} from "next/navigation";

const BarraDeBusqueda = styled(Input)`
width: 347px !important;
text-align: center;
`;

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

  const [searchValue, setSearchValue] = useState(query); // Estado para el valor del input
  const [Showinfo, setShowInfo] = useState(false); // Estado para el valor del input
  const router = useRouter()
  const handleSearchClick = () => {
    if (searchValue.trim()) {
      console.log("Redirigiendo a buscador con query:", searchValue);
      router.push(`/buscador?q=${encodeURIComponent(searchValue)}`);
    } else {
      console.log("No se ingresó ninguna búsqueda.");
      router.push('/buscador');
    }
  };

  const handleShowInfo = () => {
    setShowInfo(prev => !prev)
  }

return (
  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100vw", alignItems: "center", padding: 0, margin: 0, height: "100vh", backgroundColor: "#111" }}>
    <SearcherForm>
      { !Showinfo ? (
        <>
          <TitleCentrado>El mejor Pet-finder del mundo</TitleCentrado>
          <SearcherButt onClick={handleSearchClick}>Iniciar Geolocalización</SearcherButt>
          <WhatButt onClick={handleShowInfo}>¿Que es Pet Finder?</WhatButt>
        </>
      ) : (
        <>
          <Subtitle>¿Como funciona?</Subtitle>
          <Body style={{textAlign: "center"}}>A través de la geolocalización basada en una fórmula matemática para calcular la ubicación del usuario, en un radio aproximado de 100mts se podrá escanear si hay algún reporte hecho por tu zona, para que puedas estar atento de encontrar a la mascota de otro dueño y viceversa</Body>
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