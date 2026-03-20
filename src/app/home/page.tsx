'use client'
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Hub from "../components/Hub";

export default function Home() {
    const router = useRouter();
    const pathname = usePathname()
    const rawQuery = pathname || ""; // o 'q' si usás ?q= en la URL
    const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;
  return (
    <Hub query={query}></Hub>
  );
}
