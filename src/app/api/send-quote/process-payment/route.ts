import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
// Configura tu correo de admin en el .env, si no existe usa un respaldo
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "proyectos@brandlift.com.mx";

// Definimos la estructura de un servicio dentro del correo
interface ServicePayload {
  name: string;
  quantity: number;
  price: number;
}

// Definimos la estructura esperada del Body de la petición
interface EmailRequestBody {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
  services?: ServicePayload[];
  totalPrice?: number;
  type: "payment_success" | "quote_request" | string;
  orderId?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Asertamos el tipo del JSON entrante
    const body = (await request.json()) as EmailRequestBody;
    const { name, email, company, phone, message, services, totalPrice, type, orderId } = body;

    const servicesList = services && services.length > 0
      ? services.map((s: ServicePayload) => `• ${s.name} x${s.quantity} - $${(s.price * s.quantity).toLocaleString()}`).join("\n")
      : "No hay servicios seleccionados";

    let subject = "";
    let emailContent = "";

    if (type === "payment_success") {
      subject = `Recibo de Pago Confirmado - Orden ${orderId}`;
      emailContent = `
¡Hola ${name}! 
Hemos recibido tu pago correctamente en Brand Lift.

Detalles de la Orden: ${orderId}
-----------------------------------------
${servicesList}

Total Pagado: $${totalPrice?.toLocaleString()} MXN
-----------------------------------------
Nuestro equipo se pondrá en contacto contigo en breve para dar inicio al proyecto.

Atentamente,
El equipo de Brand Lift
      `.trim();
    } else {
      subject = `Nueva Solicitud de Cotización de ${name}`;
      emailContent = `
Nueva Solicitud de Cotización (Brand Lift)

Información de Contacto:
- Nombre: ${name}
- Email: ${email}
- Empresa: ${company || "No provisto"}
- Teléfono: ${phone || "No provisto"}

Servicios de Interés:
${servicesList}

Total Estimado en Carrito: $${totalPrice?.toLocaleString() || "0"}

Detalles del Proyecto:
${message || "No provisto"}
      `.trim();
    }

    if (!process.env.RESEND_API_KEY) {
      console.log("FALTA RESEND_API_KEY. Simulación de correo:");
      console.log(emailContent);
      return NextResponse.json({ success: true, message: "Modo demo" });
    }

    // ENVIAR A AMBOS: Usuario y Administrador
    const toEmails = [email, ADMIN_EMAIL];

    const { data, error } = await resend.emails.send({
      from: "BrandLift <proyectos@brandlift.com.mx>", 
      to: toEmails,
      subject: subject,
      text: emailContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Fallo al enviar correo" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("API error:", errorMessage);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}