import styled from "styled-components";
import { Large, Subtitle } from "../typography";
import { BlueButton, FucsiaButton } from "../buttons";
import { Input, Label } from "../text-field";



const Rectangle = styled.div`
  top: 1216px;
  opacity: 1;
  width: 550px;
  margin: 20px;
  background-color: #242424 !important;
  margin-bottom: 10px;
  height: 950px;
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
height: 550px;
margin: 20px 0;
gap: 20px;
background-color: #242424 !important;
left: 2px;
display: flex;
justify-content: center;
flex-direction: column;
align-items: center;
opacity: 1;
background-color: var(--fucsia);
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 100%; /* 321 - 84 (altura de OtherRectangle) */
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


interface CardProps {
  // modo visualización
  description?: string;
  name?: string;
  src?: string;
  LabelDesc?: string;      // ubicación (dirección)
  ReportID?: string;
  onNavigate?: () => void;
  isFeatured?: boolean;

  // modo creación/edición
  isEditing?: boolean;
  onChangeName?: (val: string) => void;
  onChangeDescription?: (val: string) => void;
  onChangeLastSeen?: (val: string) => void;
  onChangeImage?: (file: File) => void;
  onSubmit?: () => void;

  // nuevos callbacks para acciones
  daysRemaining?: number;          // días que le quedan al reporte
  onRenew?: (reportId: string) => void;  // función para renovar
  reportId?: string;               // ID del reporte (para identificar)
  onComplete?: (reportId: string) => void;

  // inyectar mapa
  mapComponent?: React.ReactNode;
}

export function PetCard({ 
  description = '',
  name = '',
  LabelDesc = '',
  src = 'ejemploPet.jpg', 
  onNavigate,
  isEditing = false,
  onChangeName,
  onChangeDescription,
  onChangeLastSeen,
  onChangeImage,
  onSubmit,
  mapComponent,
  daysRemaining,
  reportId,
  onRenew,
  onComplete,
}: CardProps) {
  return (
    <Rectangle className="hover-scale2" onClick={onNavigate} style={{ border: '5px solid #000' }}>
      <ImageContainer style={{ objectFit: "cover" }}>
        {isEditing ? (
          <>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => onChangeImage?.(e.target.files![0])} 
            />
            {src && src !== 'ejemploPet.jpg' && (
              <img 
                src={src} 
                alt="Vista previa" 
                style={{ width: '100%', maxHeight: '100%', objectFit: 'cover', marginTop: '8px' }} 
              />
            )}
          </>
        ) : (
          <Image src={src} />
        )}
      </ImageContainer>

      <OtherRectangle>
        {isEditing ? (
          <Input 
            style={{ width: "80%" }}
            placeholder="Nombre y especie/raza"
            value={name}
            onChange={(e) => onChangeName?.(e.target.value)}
          />
        ) : (
          <Name>{name}</Name>
        )}

        {isEditing ? (
          <Input 
            style={{ width: "80%" }}
            placeholder="Descripción de la mascota"
            value={description}
            onChange={(e) => onChangeDescription?.(e.target.value)}
          />
        ) : (
          <p style={{ margin: '8px 0' }}>{description}</p>   // 👈 Cambiado para evitar textarea
        )}

        {/* Aquí va el mapa si existe */}
        {isEditing && mapComponent}

        {isEditing ? (
          <Input 
            style={{ width: "80%" }}
            placeholder="Última ubicación vista"
            value={LabelDesc}
            onChange={(e) => onChangeLastSeen?.(e.target.value)}
          />
        ) : (
          <span>{LabelDesc}</span>
        )}

        {/* Botones solo en modo visualización y si existen los callbacks */}
          {!isEditing && daysRemaining !== undefined && (
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: daysRemaining <= 1 ? 'red' : 'white' }}>
              ⏳ {daysRemaining} días restantes
              {daysRemaining <= 1 && (
                <GreenButton
                  className="hover-scale2 hover-scale3" 
                  style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '0.7rem' }}
                  onClick={() => onRenew?.(reportId!)}
                >
                  Renovar
                </GreenButton>
              )}
            </div>
          )}
            {!isEditing && reportId && onComplete && (
            <GreenButton 
              className="hover-scale2 hover-scale3"
              style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '0.7rem' }}
              onClick={() => onComplete(reportId!)}
            >
            ✅ Encontrado
            </GreenButton>
          )}
      </OtherRectangle>

      {isEditing && (
        <GreenButton
          className="hover-scale2 hover-scale3" 
          style={{ width: "100%", padding: "10px" }}
          onClick={onSubmit}
        >
          Publicar Reporte
        </GreenButton>
      )}
    </Rectangle>
  );
}






