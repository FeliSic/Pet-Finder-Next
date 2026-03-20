// Step 1: Import the parts of the module you want to use
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import logger from "./winston-logger";

// Step 2: Initialize the client object
let client:any;
try {
  client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN_DEV || "",
    options: { timeout: 5000, idempotencyKey: "abc" },
  });
  logger.info("Mercado Pago client initialized", client);
} catch (error) {
  logger.error("Error initializing Mercado Pago client:", error);
}
const BASE_URL = process.env.VERCEL_URL || "apx.school";

// Step 3: Initialize the API object
const pref = new Preference(client);

export type CreatePrefOptions = {
  orderName: string;
  orderDescription: string;
  orderId: string;
  productId: string;
  userId: number;
  userEmail: string;
  orderPrice: number;
  transactionId: string;
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: string;
  // otros campos que tengas
};

// recibimos data más generica en esta función
// para abstraer al resto del sistema
// de los detalles de mercado pago
// esto nos permitirá hacer cambios dentro de esta librería
// sin tener que modificar el resto del sistema
export async function createSingleProductPreference(
  options: CreatePrefOptions
) {
  // Todas las opciones en
  // https://www.mercadopago.com.ar/developers/es/reference/preferences/_checkout_preferences/post
  const webhookUrl = `${process.env.WEBHOOK_URL || BASE_URL}/api/webhooks/mp/route`
  console.log("🔔 WEBHOOK URL CONFIGURADA:", webhookUrl);
  return pref.create({
    body: {
      items: [
        {
          id: options.orderId.toString(),
          title: options.orderName,
          description: options.orderDescription,
          quantity: 1,
          currency_id: "ARS",
          unit_price: options.orderPrice,
        },
      ],
      // URL de redirección en los distintos casos
      back_urls: {
        success: "https://" + BASE_URL + "/thanks",
        failure: "https://" + BASE_URL + "/donate/failure",
        pending: "https://" + BASE_URL + "/donate/pending",
      },
      // Esto puede ser el id o algún otro identificador
      // que te ayude a vincular este pago con el producto más adelante
      // ✅ IMPORTANTE: Agregá la notification_url
      notification_url: `${process.env.WEBHOOK_URL || BASE_URL}/api/webhooks/mp/route`,
      external_reference: options.transactionId.toString(),
    },
  });
}

export async function getPaymentById(id: number) {
  const payment = new Payment(client);
  return payment.get({ id });
}

export type WebhokPayload = {
  action: string;
  api_version: string;
  data: {
    id: number;
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: string;
  user_id: number;
};

//# En una terminal nueva
//npx ngrok http 4004
// Luego, copiar la URL generada y usarla para configurar el webhook en MercadoPago