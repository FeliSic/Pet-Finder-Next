import Image from "next/image";
import LogIn from "./components/login";

export default function Login() {
  return (
    <div style={{display:"flex", textAlign:"center", flexDirection:"column", justifyContent:"center",backgroundColor: "#000", height:"100vh"}}>
      <LogIn></LogIn>
    </div>
  );
}
