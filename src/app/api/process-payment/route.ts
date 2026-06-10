import { NextResponse } from 'next/server';

// Usamos exactamente el string de tu código funcional
const ETOMIN_URL = (process.env.ETOMIN_API_URL || "https://pagos.etomin.com/api/v1").replace(/\/$/, "");

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Origin": "https://brandlift.com.mx",
    "Referer": "https://brandlift.com.mx/", 
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Interfaces para tipado estricto
interface BillingInfo { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; state: string; zip: string; country: string; }
interface CardInfo { number: string; name: string; expMonth: string; expYear: string; cvv: string; }
interface PaymentItem { id: string; name: string; price: number; quantity: number; }
interface PaymentPayload { billing: BillingInfo; card: CardInfo; items: PaymentItem[]; totalPrice: number; notes?: string; }

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PaymentPayload;
    const { billing, card, items, totalPrice } = body;

    if (!process.env.ETOMIN_EMAIL || !process.env.ETOMIN_PASSWORD) {
      throw new Error("Faltan las credenciales de Etomin en .env");
    }

    // -----------------------------------------
    // 1. SIGNIN
    // -----------------------------------------
    const authRes = await fetch(`${ETOMIN_URL}/signin`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        email: process.env.ETOMIN_EMAIL,
        password: process.env.ETOMIN_PASSWORD,
      }),
    });
    
    // Parseo seguro usando .text() como en tu código funcional
    const authText = await authRes.text();
    let authData;
    try { authData = JSON.parse(authText); } catch(e) { throw new Error(`Etomin Auth falló: ${authText.substring(0, 50)}`); }
    if (!authData.authToken) throw new Error(authData.error || "No se pudo obtener el token.");

    // -----------------------------------------
    // 2. TOKENIZER
    // -----------------------------------------
    // Etomin requiere años de 4 dígitos en algunas validaciones (2026 en lugar de 26)
    const shortYear = card.expYear.trim();
    const year = shortYear.length === 2 ? `20${shortYear}` : shortYear; 

    const tokenizeRes = await fetch(`${ETOMIN_URL}/card/tokenizer`, {
      method: "POST",
      headers: getHeaders(authData.authToken),
      body: JSON.stringify({
        cardData: {
          cardNumber: card.number.replace(/\s/g, ""),
          cardholderName: card.name,
          expirationMonth: card.expMonth.trim().padStart(2, '0'),
          expirationYear: year,
        }
      }),
    });
    
    const tokenizeText = await tokenizeRes.text();
    let tokenData;
    try { tokenData = JSON.parse(tokenizeText); } catch(e) { throw new Error(`Etomin Tokenizer falló: ${tokenizeText.substring(0, 50)}`); }
    if (!tokenData.cardNumberToken) throw new Error(tokenData.error || "Error al encriptar la tarjeta.");

    // -----------------------------------------
    // 3. PREPARAR DATOS PARA EL COBRO
    // -----------------------------------------
    const numericAmount = Number(Number(totalPrice).toFixed(2));
    const uniqueOrderId = `ORD-${Date.now()}`;

    const itemsPayload = (items || []).map((item: PaymentItem) => ({
      title: item.name,
      amount: Number(Number(item.price).toFixed(2)),
      quantity: item.quantity || 1,
      id: item.id
    }));

    const salePayload = {
      amount: numericAmount,
      currency: 484,
      reference: uniqueOrderId,
      customerInformation: {
        firstName: billing.firstName || "Cliente",
        lastName: billing.lastName || "N/A",
        middleName: "",
        email: billing.email,
        phone1: billing.phone || "0000000000",
        city: billing.city || "CDMX",
        address1: billing.address || "No provista",
        postalCode: billing.zip || "00000",
        state: billing.state || "CDMX",
        country: "MX",
        ip: req.headers.get("x-forwarded-for") || "127.0.0.1"
      },
      cardData: {
        cardNumberToken: tokenData.cardNumberToken,
        cvv: card.cvv
      },
      items: itemsPayload.length > 0 ? itemsPayload : [{ title: "Servicio", amount: numericAmount, quantity: 1, id: "SRV-01" }],
      // Usamos el redirect que definiste, ajustable al entorno
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://brandlift.com.mx"}/es/checkout/callback`
    };

    // -----------------------------------------
    // 4. SALE (Cobro)
    // -----------------------------------------
    const saleRes = await fetch(`${ETOMIN_URL}/sale`, {
      method: "POST",
      headers: getHeaders(authData.authToken),
      body: JSON.stringify(salePayload),
    });

    const saleText = await saleRes.text();
    let saleData;
    try { saleData = JSON.parse(saleText); } catch(e) { throw new Error(`Etomin Sale Crash 500: ${saleText.substring(0, 80)}`); }

    if (saleData.status === "APPROVED" || saleData.status === "PENDING") {
      return NextResponse.json({ 
        success: true, 
        status: saleData.status,
        orderId: uniqueOrderId,
        transactionId: saleData.transactionId,
        redirectTo: saleData.redirectTo
      });
    } else {
      return NextResponse.json({ success: false, error: saleData.message || saleData.status || "Pago declinado." }, { status: 400 });
    }

  } catch (error: unknown) {
    let errorMessage = "Error del servidor";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      const errWithCause = error as Error & { cause?: unknown };
      if (errWithCause.cause) {
        errorMessage += ` (Causa interna: ${String(errWithCause.cause)})`;
      }
    }
    
    console.error("API Checkout Error:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}