'use client';
import "@/styles/global.css"; // Asegúrate de que este archivo contenga el CSS global
import { Header } from "./components/header"; // Ajustá la ruta según donde esté tu Header
import { Footer } from "@/ui/layout/index"; // Ajustá la ruta según donde esté tu Footer
import { usePathname } from 'next/navigation'; // Importa usePathname

export default function Layout({ children }: any) {
  const pathname = usePathname(); // Obtiene el pathname actual

  return (
    <html lang="es">
      <body>
        {/* Renderiza el Header solo si no estás en la ruta '/' */}
        {pathname !== '/' && <Header />}
        <main>{children}</main>
        {/* Renderiza el Footer solo si no estás en la ruta '/' */}
        {pathname !== '/' && <Footer />}
      </body>
    </html>
  );
}
