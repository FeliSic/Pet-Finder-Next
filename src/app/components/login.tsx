"use client";
import { useState } from "react";
import { sendAuthEmail, getToken } from "lib/apiFetcher";
import {
  LogInContainer,
  LogInForm,
  FormInput,
  FormButton,
  SubtitleIngresar,
} from "@/ui/form";
import { Tiny } from "@/ui/typography";

export default function LogIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelePhone] = useState(0); // Inicializa como null
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // Estado para el paso actual
  const [termsAccepted, setTermsAccepted] = useState(false); // Estado para los términos
  const [allowLocationNotifications, setallowLocationNotifications] =
    useState(true); // Estado para los términos

  const handleEmailSubmit = async (e: any) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2); // Avanzar al siguiente paso
    } else if (step === 2) {
      // Validar que los términos estén aceptados
      if (termsAccepted) {
        setStep(3); // Avanzar al siguiente paso
      }
    } else if (step === 3) {
      const result = await sendAuthEmail(
        name,
        email,
        telephone,
        allowLocationNotifications,
      );
      console.log(result);
      if (result.success) {
        setStep(4); // Avanzar al paso de código
      } else {
        alert("Error sending auth email: " + result.error);
      }
    }
  };

  const handleTokenSubmit = async (e: any) => {
    e.preventDefault();
    const result = await getToken(email, code);
    console.log("Resultado completo de getToken:", result);
    if (result.success) {
      localStorage.setItem("apiToken", result.token || "");
      localStorage.setItem("userEmail", result.email || "");
      localStorage.setItem("userId", result.userId?.toString() || "");
      window.location.href = "/home";
    } else {
      alert("Error getting token: " + result.error);
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem("apiToken", "demo-token");
    localStorage.setItem("userEmail", "demo@demo.com");
    localStorage.setItem("userId", "1000");

    window.location.href = "/home";
  };
  return (
    <LogInContainer>
      <LogInForm
        className="hover-scale2 hover-scale3"
        onSubmit={step === 4 ? handleTokenSubmit : handleEmailSubmit}
      >
        {step === 1 && (
          <>
            <p>
              ¿Qué es Pet Finder? Una pequeña explicación sobre el servicio...
            </p>
            <FormButton className="hover-scale2" type="submit">
              Siguiente
            </FormButton>
          </>
        )}
        {step === 2 && (
          <>
            <p>Términos y condiciones</p>
            <label>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              Acepto los términos y condiciones
            </label>
            <label style={{ marginTop: "10px", display: "block" }}>
              <input
                type="checkbox"
                checked={allowLocationNotifications}
                onChange={(e) => {
                  setallowLocationNotifications(e.target.checked);
                  console.log(
                    "allowLocationNotifications changed to",
                    e.target.checked,
                  );
                }}
              />
              Quiero recibir notificaciones por email cuando haya reportes de
              mascotas perdidas cerca de mi zona (puedo desactivar luego en mi
              perfil)
            </label>
            <FormButton
              type="submit"
              disabled={!termsAccepted} // Deshabilitar si no está chequeado
            >
              Siguiente
            </FormButton>
          </>
        )}
        {step === 3 && (
          <>
            <SubtitleIngresar>Ingresar</SubtitleIngresar>
            <FormInput
              type="name"
              placeholder="Nombre y apellido"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <FormInput
              type="email"
              placeholder="Email de contacto y cuenta"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormInput
              type="tel"
              placeholder="Teléfono de contacto"
              value={telephone.toString()}
              onChange={(e) => setTelePhone(Number(e.target.value))}
            />
            <FormButton type="submit">Siguiente</FormButton>
            <FormButton type="button" onClick={handleDemoLogin}>
              Probar Demo
            </FormButton>
          </>
        )}
        {step === 4 && (
          <>
            <SubtitleIngresar>Código de Verificación</SubtitleIngresar>
            <FormInput
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código de Verificación"
            />
            <Tiny>
              Ingresa el código de verificación que se envió a tu correo
              electrónico
            </Tiny>
            <FormButton type="submit">Ingresar</FormButton>
          </>
        )}
      </LogInForm>
    </LogInContainer>
  );
}
