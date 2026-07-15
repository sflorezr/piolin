import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatearFecha(fecha: Date) {
  return fecha.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
}
