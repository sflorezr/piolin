import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatearFecha(fecha: Date) {
  return fecha.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
}

export function obtenerSemanaActual(referencia: Date = new Date()) {
  const dia = referencia.getDay();
  const diferenciaAlLunes = dia === 0 ? -6 : 1 - dia;

  const inicio = new Date(referencia);
  inicio.setHours(0, 0, 0, 0);
  inicio.setDate(inicio.getDate() + diferenciaAlLunes);

  const fin = new Date(inicio);
  fin.setDate(inicio.getDate() + 4);
  fin.setHours(23, 59, 59, 999);

  return { inicio, fin };
}
