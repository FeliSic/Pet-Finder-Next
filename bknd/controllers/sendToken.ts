let codeStore: Record<string, string> = {}; // guardamos códigos por email

export function sendCode(email: string): { success: boolean; code?: string } {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // código 6 dígitos
  codeStore[email] = code; // guardamos el código para ese email
  console.log(`Código para ${email}: ${code}`); // simula enviar email
  return { success: true, code };
}


export function getTokenNow(email: string, code: string): { success: boolean; token?: string; error?: string } {
  const savedCode = codeStore[email];
  if (savedCode && savedCode === code) {
    const token = `token-${email}-${Date.now()}`; // token simple simulado
    return { success: true, token };
  }
  return { success: false, error: 'Código inválido' };
}
