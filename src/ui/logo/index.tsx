import WhiteHuellitaISO from "./PetLogoISO.svg"
import WhiteHuellita from "./CompletePetLogo.svg"

export function TotalPetLogo(props:any) {
  return <img src={WhiteHuellita.src} {...props} alt="Total Logo" ></img>
}


export function ISOHuellita(props:any) {
  return <img src={WhiteHuellitaISO.src}  {...props} alt="ISO Huellita"></img>
}




