import { randomUUID } from "crypto";
import { getSupabase, BUCKET_FOTOS } from "@/lib/supabase";

export async function subirFoto(file: File, carpeta: string): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const supabase = getSupabase();
  const extension = file.name.split(".").pop() ?? "jpg";
  const ruta = `${carpeta}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET_FOTOS).upload(ruta, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`No se pudo subir la foto: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET_FOTOS).getPublicUrl(ruta);
  return data.publicUrl;
}
