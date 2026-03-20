import styled from "styled-components";
import { Large, Subtitle } from "../typography";
import { BlueButton, FucsiaButton } from "../buttons";
import { Label } from "../text-field";



const Rectangle = styled.div`
  top: 1216px;
  opacity: 1;
  width: 550px;
  margin: 20px;
  margin-bottom: 10px;
  height: 650px;
  display: flex; /* Agregado */
  flex-direction: column; /* Alinea en columna */
  justify-content: flex-end; /* Alinea al final (parte inferior) */
  border-radius: var(--radius);
  border: 4px solid #000;

  @media (min-width: 748px){
    margin-bottom: 30px;
  }
`

const Description = styled.textarea`
  flex-wrap: wrap; /* Ocupa el espacio disponible */
  text-align: center;
  padding-top: 10px;
  background-color: #111;
  border: 2px solid #eee;
  color: #eee;
  border-radius: 5px;
  min-height: 150px;
  min-width: 95%;
`;

export const Name = styled(Subtitle)`
  text-align: center;
  white-space: nowrap; /* Evita que el precio se ajuste */
`;


const OtherRectangle = styled.div`
height: 250px;
background-color: #242424 !important;
top: 234px;
left: 2px;
display: flex;
flex-direction: column;
align-items: center;
opacity: 1;
background-color: var(--fucsia);
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 421px; /* 321 - 84 (altura de OtherRectangle) */
  overflow: hidden;
  border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);
`;

export const LastSeenContainer = styled.div`
  padding: 10px;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Para que la imagen cubra el contenedor sin deformarse */
  display: block;
`;

interface CardProps {
  description?: string;
  name?: string;
  src?: string;
  LabelDesc? : string;
  lastSeen?: string;
  ReportID?: string;
  onNavigate?: () => void;
  isFeatured?: boolean; // Prop opcional para indicar si es destacada
}

export const PetLabel = styled(Label)`
  text-align: center;
  align-items: center;
`
export const GreenButton = styled(BlueButton)`
  background-color: #A9FF75;
  border-radius: 0px;
`

export const CreateReportButton = styled(FucsiaButton)`
  width: 300px;
  padding: 30px;
  margin-top: 70px;
  border-radius: 5px;
`


export function PetCard({ 
  description = "Detalles que quiera dar el dueño sobre su mascota", 
  name = "nombre de mascota y especie/raza", 
  LabelDesc = "Detalles que quiera dar el dueño sobre su mascota",
  src = "ejemploPet.jpg", 
  onNavigate, 
  // isFeatured = false // Por defecto, no es destacada
}: CardProps) {
  return (
    <Rectangle onClick={onNavigate} style={{ border: '5px solid #000' }}> {/* Ejemplo de estilo diferente */}
      <ImageContainer>
        <Image src={src} />
      </ImageContainer>
        <OtherRectangle>
        <Name>{name}</Name>
        <PetLabel> {LabelDesc}
        <Description>{}</Description>
        </PetLabel>
        <LastSeenContainer>ACA IRIA EL MAPA PARA PONER LA UBICACION</LastSeenContainer>
        </OtherRectangle>
      <GreenButton style={{width: "100%", padding: "10px"}}>Publicar Reporte</GreenButton>
    </Rectangle>
  );
}








