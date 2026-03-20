import styled from "styled-components";
import { ISOHuellita,  TotalPetLogo } from "../logo";
import { FucsiaButton, YellowButton } from "../buttons";
import { Body } from "../typography";
import { Input, Label } from "../text-field";
import Link from "next/link";

const HeaderRectangle = styled.header`
  width:100vw;
  height: 84px;
  background-color: #212121;
  position: sticky; /* Fijo en la parte superior */

`

const ContainerHeaderButton = styled.div`
  display: flex; /* Usar flexbox */
  flex-direction: row;
  justify-content: space-between; /* Espacio entre los elementos */
  align-items: center; /* Centrar verticalmente */
  margin-left: 20px;
  height: 100%; /* Asegúrate de que ocupe toda la altura del header */


  @media (min-width: 768px) {
    /* Ocultar el botón de hamburguesa y el logo del carrito */
    .hamburger,
    .pet-logo {
      display: none;
    }
    .fucsia-button,
    .total-logo {
      display: flex; /* O cualquier otra propiedad que necesites */
    }
  }
        @media (max-width: 768px) {
    /* Ocultar el botón de hamburguesa y el logo del carrito */
    .fucsia-button,
    .total-logo {
      display: none; /* O cualquier otra propiedad que necesites */
    }
  }
  
`
const MiniRectangle = styled.div`
  width: 52px;
  height: 8px;
  margin: 2px 0;
  background-color: #fff;
`
const HeaderButton = styled(YellowButton)`
  background-color: #D6C7FF;
`

const ContainerHamburger = styled(ContainerHeaderButton)`
  flex-direction: column;
  justify-content: center; /* Espacio entre los elementos */
  align-items: end; /* Centrar verticalmente */
  margin-right: 40px;
  height: 100%; /* Asegúrate de que ocupe toda la altura del header */
`

export const BusquedaHeader = styled(Input)`
  padding: 0 40px;
  background-color: transparent;
  border-color: #fff;
  color: #fff;
  width: 100%;
`;

export const BusquedaHeaderButt = styled(YellowButton)`
  padding: 0 5px;
  width: 100%;
`

export const SearcherContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;


export function HeaderSearcher({ handleSearchClick, searchValue, onSearchChange }: { handleSearchClick: (query: string) => void; searchValue: string; onSearchChange: (value: string) => void; }) {
  return (
    <SearcherContainer>
      <BusquedaHeader 
        placeholder="Buscar productos..." 
        value={searchValue} // Asignar el valor del input
        onChange={(e) => onSearchChange(e.target.value)} // Manejar el cambio del input
      />
      <BusquedaHeaderButt onClick={() => handleSearchClick(searchValue)}>BUSCAR</BusquedaHeaderButt>
    </SearcherContainer>
  );
}




export function HeaderUi({ children, toggleMenu, menuOpen, owner, handleLogout, windowWidth }: { children: React.ReactNode; toggleMenu: () => void; menuOpen: boolean; owner?: any, handleLogout: (href: string) => void, windowWidth: number }) {
  return (
    <HeaderRectangle>
      <ContainerHeaderButton>
        <Link href="/home">
          <ISOHuellita className="pet-logo" /> {/* Logo completo */}
          <TotalPetLogo className="total-logo"></TotalPetLogo>
        </Link>
        {children}
        <ContainerHamburger onClick={() => {
          if (windowWidth < 768) toggleMenu();
        }}>
          <div className="hamburger">
            <MiniRectangle />
            <MiniRectangle />
            <MiniRectangle />
          </div>
          {/* Solo mostrar usuario logueado */}
          <div style={{ display: windowWidth < 768 ? 'none' : 'flex', flexDirection: 'column', marginTop: '-60px', height: "20px" }}>
            <UserEmail>{owner?.email}</UserEmail> {/* Muestra el email del usuario */}
            <UserPhone>{owner?.telephone}</UserPhone> {/* Muestra el telefono del usuario */}
            <LogoutButton onClick={() => handleLogout("/")}>Cerrar Sesión</LogoutButton>
          </div>
        </ContainerHamburger>
      </ContainerHeaderButton>
    </HeaderRectangle>
  );
}


export const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000; /* Fondo negro semi-transparente */
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  justify-content: center;
  z-index: 999; /* Asegúrate de que esté por encima de otros elementos */
`;



const StyledMenuItem = styled(Link)`
  color: #fff;
  text-decoration: none;
  margin: 20px 0;
  font-size: 50px;
  cursor: pointer;
`;

export const MenuItem = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  return (
    <StyledMenuItem href={href} onClick={onClick}>
      {children}
    </StyledMenuItem>
  );
};

export const UserEmail = styled.div`
  color: #fff;
  margin-bottom: 5px ;
  font-size: 18px;
`;
export const UserPhone = styled(UserEmail)`
  color: #fff;
  text-align: center;
  margin-bottom: 12px ;
  font-size: 18px;
`;

export const LogoutButton = styled.button`
  background-color: transparent;
  color: #fff;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;





// ----------------------------------------------------------------------------------------------------------------------------------------------------
const FooterRectangle = styled.footer`
  width:100vw;
  background-color: #212121;
  display: flex;
  flex-wrap: wrap;
  margin-top: 0 auto;
  gap: 20px;
  bottom: 0;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }

  @media (max-width: 767px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px;
`;

const RedesContainer = styled.div`
  display: flex;
  flex-direction: column; /* siempre en columna */
  align-items: flex-end;
  margin-right: 30px;
  margin-top: 15px;
`;

const RedesLabel = styled(Label)`
  display: flex;          /* faltaba */
  flex-direction: column; /* siempre en columna */
  align-items: flex-start;
  gap:20px;
  color: #fff;
  font-size: 25px;
  flex: 1;
`;
export function RedLabel({ children }: { children: React.ReactNode }) {
  return (
    <RedesLabel>
      Redes
      {children} {/* Aquí se renderiza el valor que le pases como prop */}
    </RedesLabel>
  );
}


const License = styled(Body)`
  color: #fff;
  width: 100%;
  margin-left: 20px;
  padding-bottom: 10px;
  margin-top: auto; /* Para que quede abajo en desktop */
`


const Ingresar = styled(Link)`
  color: #fff;
  margin-bottom: 30px;
  `;

const Search = styled(Ingresar)`
`;
const MyProfile = styled(Ingresar)``;

const Logout = styled(Ingresar)`
  color: #fff;
  margin-bottom: 30px;
`;
const Link1 = styled.a`
  color: #fff;
  font-size: 16px;
  margin: 5px;
`;
const Link2 = styled(Link1)`
  color: #fff;
  margin-bottom: 30px;
`;

export function Footer() {
  return (
    <FooterRectangle>
      <OptionsContainer>
      <MyProfile href="/home">Home</MyProfile>
      <Search href="/MisReportes">Mis Reportes</Search>
      <Logout href="/">Logout</Logout>
      </OptionsContainer>
      <RedesContainer>
        <RedLabel>
          <Link1 href="https://www.google.com">My Pet-finder</Link1>
          <Link2 href="https://www.youtube.com">My Pet-finder</Link2>
        </RedLabel>
        <div style={{marginRight: "35px"}}>
          <Link href="/home">
          <ISOHuellita></ISOHuellita>
          </Link>
        </div>
      </RedesContainer>
      <License>@2026 Licensed</License>
    </FooterRectangle>
  );
}

