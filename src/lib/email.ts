import nodemailer, { type Transporter } from "nodemailer";
import { formatearFecha } from "@/lib/utils";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  return transporter;
}

export async function enviarReporteSemanal(params: {
  destinatarios: string[];
  ninoNombre: string;
  htmlReporte: string;
  adjuntoPdf: Buffer;
  nombreAdjunto: string;
}) {
  const { destinatarios, ninoNombre, htmlReporte, adjuntoPdf, nombreAdjunto } = params;

  return getTransporter().sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: destinatarios.join(", "),
    subject: `Reporte semanal - ${ninoNombre}`,
    html: htmlReporte,
    attachments: [
      {
        filename: nombreAdjunto,
        content: adjuntoPdf,
        contentType: "application/pdf",
      },
    ],
  });
}

export async function enviarReporteEspecial(params: {
  destinatarios: string[];
  ninoNombre: string;
  actividadNombre: string;
  fecha: Date;
  comentario: string | null;
  fotos: { filename: string; url: string }[];
}) {
  const { destinatarios, ninoNombre, actividadNombre, fecha, comentario, fotos } = params;

  const htmlReporte = `
    <h2>${actividadNombre} — ${ninoNombre}</h2>
    <p>${formatearFecha(fecha)}</p>
    ${comentario ? `<p>${comentario}</p>` : ""}
    <p>Encontrarás las fotos de la actividad adjuntas a este correo.</p>
  `;

  return getTransporter().sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: destinatarios.join(", "),
    subject: `${actividadNombre} - ${ninoNombre}`,
    html: htmlReporte,
    attachments: fotos.map((foto) => ({ filename: foto.filename, path: foto.url })),
  });
}
