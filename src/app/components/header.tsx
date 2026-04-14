"use client";
import { useEffect, useState } from "react";
import {
  HeaderUi,
  HeaderSearcher,
  MenuOverlay,
  MenuItem,
  UserEmail,
  LogoutButton,
  UserPhone,
} from "@/ui/layout";
import { usePathname, useRouter } from "next/navigation";
import { useMe } from "lib/hooks";
import { mutate } from "swr";

export function Header() {
  const { data, error, isLoading } = useMe();
  console.log(data);
  const pathname = usePathname();
  const router = useRouter();
  const showSearch = pathname === "/buscador";
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar el menú
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1000,
  );
  const [searchValue, setSearchValue] = useState(""); // Estado para el valor del input

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen); // Alternar el estado del menú

  const handleLogout = (href: string) => {
    // Lógica para cerrar sesión, por ejemplo, eliminar el token de autenticación
    localStorage.removeItem("apiToken"); // Eliminar el token del almacenamiento local
    mutate("/api/me/me", undefined, { revalidate: false }); // Invalidar el cache de SWR para el endpoint de usuario
    router.push(href); // Redirigir al usuario a la página principal o de inicio de sesión
  };

  const handleMenuItemClick = (href: string) => {
    toggleMenu(); // Cerrar el menú
    router.push(href); // Redirigir a la nueva página
  };

  const handleSearchClick = (query: string) => {
    if (pathname === "/buscador") {
      console.log("Redirigiendo a buscador con query:", query);
      router.push("/buscador?q=" + query);
    } else {
      router.push("/buscador");
    }
    setSearchValue("");
  };

  return (
    <>
      <HeaderUi
        toggleMenu={toggleMenu}
        menuOpen={menuOpen}
        owner={data?.owner}
        handleLogout={handleLogout}
        windowWidth={windowWidth}
      >
        {showSearch && (
          <HeaderSearcher
            handleSearchClick={handleSearchClick}
            searchValue={searchValue} // Pasar el valor del input
            onSearchChange={setSearchValue} // Pasar la función para actualizar el valor
          ></HeaderSearcher>
        )}
      </HeaderUi>
      {menuOpen && (
        <MenuOverlay>
          <MenuItem href="/home" onClick={() => handleMenuItemClick("/home")}>
            Home
          </MenuItem>
          <MenuItem
            href="/MisReportes"
            onClick={() => handleMenuItemClick("/MisReportes")}
          >
            Mis Reportes
          </MenuItem>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "20px",
            }}
          >
            <UserEmail>{data.owner.email}</UserEmail>{" "}
            {/* Muestra el email del usuario */}
            <UserPhone>{data.owner.telephone}</UserPhone>{" "}
            {/* Muestra el telefono del usuario */}
            <LogoutButton onClick={() => handleLogout("/")}>
              Cerrar Sesión
            </LogoutButton>
          </div>
        </MenuOverlay>
      )}
    </>
  );
}
