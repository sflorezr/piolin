import nodemailer, { type Transporter } from "nodemailer";

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
