import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "proyectos@brandlift.com.mx"; 

interface EmailItem {
  name: string;
  quantity: number;
  price: number;
}

interface EmailPayload {
  type: "quote_request" | "payment_success";
  lang: "en" | "es";
  name: string;
  email: string;
  phone?: string;
  address?: string;
  message?: string;
  orderId?: string;
  items?: EmailItem[];
  subtotal?: number;
  iva?: number;
  total?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EmailPayload;
    const { type, lang, name, email, phone, address, message, orderId, items = [], subtotal = 0, iva = 0, total = 0 } = body;

    const isEs = lang !== "en";

    // Diccionario de Correos
    const t = {
      quoteSubject: isEs ? `Nueva Cotización: ${name}` : `New Quote Request: ${name}`,
      paymentSubject: isEs ? `Recibo de Pago Confirmado - Orden ${orderId}` : `Payment Receipt - Order ${orderId}`,
      greeting: isEs ? `Hola ${name},` : `Hello ${name},`,
      quoteIntro: isEs ? "Hemos recibido tu solicitud con los siguientes detalles:" : "We have received your request with the following details:",
      paymentIntro: isEs ? "Hemos procesado tu pago exitosamente. Aquí tienes el recibo de tu compra:" : "We have successfully processed your payment. Here is your receipt:",
      detailsLabel: isEs ? "Detalles del Cliente:" : "Customer Details:",
      nameLabel: isEs ? "Nombre:" : "Name:",
      emailLabel: "Email:",
      phoneLabel: isEs ? "Teléfono:" : "Phone:",
      addressLabel: isEs ? "Dirección:" : "Address:",
      msgLabel: isEs ? "Mensaje del Proyecto:" : "Project Details:",
      orderLabel: isEs ? "ID de Orden:" : "Order ID:",
      summary: isEs ? "Resumen de Servicios" : "Services Summary",
      service: isEs ? "Servicio" : "Service",
      qty: isEs ? "Cant." : "Qty",
      price: isEs ? "Precio" : "Price",
      subtotalLabel: "Subtotal:",
      ivaLabel: isEs ? "IVA (16%):" : "VAT (16%):",
      totalLabel: "Total:",
      footer: isEs 
        ? "Nuestro equipo se pondrá en contacto contigo muy pronto.<br><br>Atentamente,<br><strong>El equipo de Brand Lift</strong>" 
        : "Our team will contact you very soon.<br><br>Best regards,<br><strong>The Brand Lift Team</strong>"
    };

    let htmlContent = "";
    const f = (num: number) => `$${Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // =========================================================================
    // PLANTILLA 1: COMPROBANTE DE PAGO (Con tabla de precios y totales)
    // =========================================================================
    if (type === "payment_success") {
      const itemsHtml = items.length > 0 
        ? items.map(i => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${i.name}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${i.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${f(i.price * i.quantity)}</td>
            </tr>
          `).join("")
        : `<tr><td colspan="3" style="padding: 10px;">${isEs ? "Servicio a la medida" : "Custom Service"}</td></tr>`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #c25e3d; font-family: Georgia, serif;">Brand Lift</h2>
          <p style="font-size: 16px;">${t.greeting}</p>
          <p>${t.paymentIntro}</p>
          
          <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-top: 30px;">${t.detailsLabel}</h3>
          <ul style="list-style: none; padding: 0; line-height: 1.6;">
            <li><strong>${t.emailLabel}</strong> ${email}</li>
            ${phone ? `<li><strong>${t.phoneLabel}</strong> ${phone}</li>` : ""}
            ${address ? `<li><strong>${t.addressLabel}</strong> ${address}</li>` : ""}
            ${orderId ? `<li><strong>${t.orderLabel}</strong> ${orderId}</li>` : ""}
          </ul>

          <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-top: 30px;">${t.summary}</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">${t.service}</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">${t.qty}</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">${t.price}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; color: #666; padding-top: 15px;">${t.subtotalLabel}</td>
                <td style="padding: 8px; text-align: right; color: #666; padding-top: 15px;">${f(subtotal)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; color: #666;">${t.ivaLabel}</td>
                <td style="padding: 8px; text-align: right; color: #666;">${f(iva)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">${t.totalLabel}</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #c25e3d;">${f(total)}</td>
              </tr>
            </tfoot>
          </table>

          <p style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; color: #666; font-size: 14px;">
            ${t.footer}
          </p>
        </div>
      `;
    } 
    // =========================================================================
    // PLANTILLA 2: SOLICITUD DE COTIZACIÓN (Formulario, datos de contacto)
    // =========================================================================
    else {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #c25e3d; font-family: Georgia, serif;">Brand Lift</h2>
          <p style="font-size: 16px;">${t.greeting}</p>
          <p>${t.quoteIntro}</p>

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #eee;">
            <p style="margin: 0 0 10px 0;"><strong>${t.nameLabel}</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>${t.emailLabel}</strong> ${email}</p>
            ${phone ? `<p style="margin: 0 0 10px 0;"><strong>${t.phoneLabel}</strong> ${phone}</p>` : ''}
          </div>

          <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-top: 30px;">${t.msgLabel}</h3>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">
            ${message || (isEs ? "Sin detalles adicionales." : "No additional details provided.")}
          </div>

          <p style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; color: #666; font-size: 14px;">
            ${t.footer}
          </p>
        </div>
      `;
    }

    if (!process.env.RESEND_API_KEY) {
      console.log("SIMULACIÓN DE CORREO (Falta RESEND_API_KEY):", htmlContent);
      return NextResponse.json({ success: true, message: "Modo demo" });
    }

    const { data, error } = await resend.emails.send({
      from: "Brand Lift <proyectos@brandlift.com.mx>", 
      to: [email, ADMIN_EMAIL],
      subject: type === "quote_request" ? t.quoteSubject : t.paymentSubject,
      html: htmlContent,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error del servidor";
    console.error("API Email Error:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}