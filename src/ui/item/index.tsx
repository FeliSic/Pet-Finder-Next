import styled from "styled-components";
import { ImageContainer, Price, Image } from "../cards";
import { BlueButton } from "../buttons";
import { Subtitle, Tiny } from "../typography";

const ItemName = styled(Subtitle)``

export const ItemPrice = styled(Price)`
  margin: 0;
  font-size: 1.2em;
`


export const ItemButton = styled(BlueButton)`
  background-color: var(--celeste);
`

const ItemDescription = styled(Tiny)`
  font-size: 0.9em;
`

const ItemImageContainer= styled(ImageContainer)`
  width: 40%;
  height: auto;

    @media (max-width: 768px) {
    width: 100%;
  }
`

const ItemImage= styled(Image)`
  object-fit: contain; /* Para que la imagen se ajuste al contenedor sin recortarse */
`


const ItemContainer = styled.div`
  max-width: 1200px;
  width: 100vw;
  display: flex;
  padding: 50px;
  margin: 0 auto;
  flex-direction: row;
  height: 100vh;
  align-items: center;
  justify-content: center;
  gap: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`

export function ItemUI({name="Reloj",description="Reloj:Este reloj es hecho 100% con minerales extraidos de minas ecologicas sin explotar y ademas a un precio reducido para mantener su bolsillo sano", price="$450", src="reloj.png", objectID="1", onGoCheckoutClick}: {name?: string, description?: string, price?: string, src?: string, objectID?: string, onGoCheckoutClick?: () => void; }) {
  return (
    <ItemContainer>
      <ItemImageContainer>
        <ItemImage src={src}/>
      </ItemImageContainer>
      <div style={{display: "flex", flexDirection: "column", gap: "10px", flexWrap: "wrap", maxWidth: "300px"}}>
      <ItemName>{name}</ItemName>
      <ItemPrice>{price}</ItemPrice>
      <ItemButton onClick={onGoCheckoutClick}>Comprar</ItemButton>
      <ItemDescription>{description}</ItemDescription>
      </div>
    </ItemContainer>
  );
}

export function CheckoutUI({name="",description="Reloj:Este reloj es hecho 100% con minerales extraidos de minas ecologicas sin explotar y ademas a un precio reducido para mantener su bolsillo sano", price="", src="reloj.png", objectID="1", onConfirmClick}: {name?: string, description?: string, price?: string, src?: string, objectID?: string, onConfirmClick?: () => void;}) {
  return (
    <ItemContainer>
      <ItemImageContainer>
        <ItemImage src={src}/>
      </ItemImageContainer>
      <div style={{display: "flex", flexDirection: "column", gap: "10px", flexWrap: "wrap", maxWidth: "300px"}}>
      <ItemName>{name}</ItemName>
      <ItemPrice>{price}</ItemPrice>
      <ItemButton onClick={onConfirmClick}>Confirmar Compra</ItemButton>
      <ItemDescription>{description}</ItemDescription>
      </div>
    </ItemContainer>
  );
}


