import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "proyectos@brandlift.com.mx";

interface ServicePayload {
  name: string;
  quantity: number;
  price: number;
}

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
  lang?: 'en' | 'es'; // Agregamos el idioma como parámetro opcional
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EmailRequestBody;
    const { name, email, company, phone, message, services, totalPrice, type, orderId, lang } = body;

    // Detectar el idioma (por defecto español)
    const language = lang === 'en' ? 'en' : 'es';

    // Mini diccionario para los correos
    const i18n = {
      en: {
        noServices: "No services selected",
        paymentSubject: (id: string) => `Payment Receipt Confirmed - Order ${id}`,
        paymentGreeting: (n: string) => `Hello ${n}!\nWe have successfully received your payment at Brand Lift.`,
        orderDetails: (id: string) => `Order Details: ${id}`,
        totalPaid: "Total Paid",
        paymentFooter: "Our team will contact you shortly to start the project.\n\nSincerely,\nThe Brand Lift Team",
        quoteSubject: (n: string) => `New Quote Request from ${n}`,
        quoteTitle: "New Quote Request (Brand Lift)",
        contactInfo: "Contact Information:",
        nameLabel: "Name",
        companyLabel: "Company",
        phoneLabel: "Phone",
        notProvided: "Not provided",
        servicesInterest: "Services of Interest:",
        estTotal: "Estimated Total in Cart",
        projectDetails: "Project Details:"
      },
      es: {
        noServices: "No hay servicios seleccionados",
        paymentSubject: (id: string) => `Recibo de Pago Confirmado - Orden ${id}`,
        paymentGreeting: (n: string) => `¡Hola ${n}!\nHemos recibido tu pago correctamente en Brand Lift.`,
        orderDetails: (id: string) => `Detalles de la Orden: ${id}`,
        totalPaid: "Total Pagado",
        paymentFooter: "Nuestro equipo se pondrá en contacto contigo en breve para dar inicio al proyecto.\n\nAtentamente,\nEl equipo de Brand Lift",
        quoteSubject: (n: string) => `Nueva Solicitud de Cotización de ${n}`,
        quoteTitle: "Nueva Solicitud de Cotización (Brand Lift)",
        contactInfo: "Información de Contacto:",
        nameLabel: "Nombre",
        companyLabel: "Empresa",
        phoneLabel: "Teléfono",
        notProvided: "No provisto",
        servicesInterest: "Servicios de Interés:",
        estTotal: "Total Estimado en Carrito",
        projectDetails: "Detalles del Proyecto:"
      }
    };

    const t = i18n[language];

    const servicesList = services && services.length > 0
      ? services.map((s: ServicePayload) => `• ${s.name} x${s.quantity} - $${(s.price * s.quantity).toLocaleString()}`).join("\n")
      : t.noServices;

    let subject = "";
    let emailContent = "";

    if (type === "payment_success") {
      const idStr = orderId || "N/A";
      subject = t.paymentSubject(idStr);
      emailContent = `
${t.paymentGreeting(name)}

${t.orderDetails(idStr)}
-----------------------------------------
${servicesList}

${t.totalPaid}: $${totalPrice?.toLocaleString()} MXN
-----------------------------------------
${t.paymentFooter}
      `.trim();
    } else {
      subject = t.quoteSubject(name);
      emailContent = `
${t.quoteTitle}

${t.contactInfo}
- ${t.nameLabel}: ${name}
- Email: ${email}
- ${t.companyLabel}: ${company || t.notProvided}
- ${t.phoneLabel}: ${phone || t.notProvided}

${t.servicesInterest}
${servicesList}

${t.estTotal}: $${totalPrice?.toLocaleString() || "0"} MXN

${t.projectDetails}
${message || t.notProvided}
      `.trim();
    }

    if (!process.env.RESEND_API_KEY) {
      console.log("FALTA RESEND_API_KEY. Simulación de correo:");
      console.log(`SUBJECT: ${subject}\n\n${emailContent}`);
      return NextResponse.json({ success: true, message: "Modo demo" });
    }

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