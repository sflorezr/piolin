import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function enviarReporteEntrega(params: {
  destinatarios: string[];
  ninoNombre: string;
  htmlReporte: string;
}) {
  const { destinatarios, ninoNombre, htmlReporte } = params;

  return transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: destinatarios.join(", "),
    subject: `Reporte de entrega - ${ninoNombre}`,
    html: htmlReporte,
  });
}
