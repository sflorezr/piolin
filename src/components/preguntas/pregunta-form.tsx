"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type TipoPregunta = "OPCION_MULTIPLE" | "ABIERTA";

export function PreguntaForm({
  action,
  valoresIniciales,
}: {
  action: (formData: FormData) => void;
  valoresIniciales?: { texto: string; tipo: TipoPregunta; opciones: string[] };
}) {
  const [tipo, setTipo] = useState<TipoPregunta>(valoresIniciales?.tipo ?? "ABIERTA");
  const [opciones, setOpciones] = useState<string[]>(
    valoresIniciales?.opciones && valoresIniciales.opciones.length > 0
      ? valoresIniciales.opciones
      : ["", ""]
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="texto">Pregunta</Label>
        <Input id="texto" name="texto" defaultValue={valoresIniciales?.texto} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tipo">Tipo de respuesta</Label>
        <Select
          id="tipo"
          name="tipo"
          value={tipo}
          onChange={(event) => setTipo(event.target.value as TipoPregunta)}
        >
          <option value="ABIERTA">Respuesta abierta</option>
          <option value="OPCION_MULTIPLE">Opción múltiple</option>
        </Select>
      </div>

      {tipo === "OPCION_MULTIPLE" && (
        <div className="flex flex-col gap-1.5">
          <Label>Opciones</Label>
          {opciones.map((opcion, indice) => (
            <div key={indice} className="flex gap-2">
              <Input
                name="opciones"
                value={opcion}
                onChange={(event) => {
                  const nuevas = [...opciones];
                  nuevas[indice] = event.target.value;
                  setOpciones(nuevas);
                }}
                required
              />
              {opciones.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpciones(opciones.filter((_, i) => i !== indice))}
                >
                  Quitar
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => setOpciones([...opciones, ""])}
          >
            Agregar opción
          </Button>
        </div>
      )}

      <Button type="submit" className="mt-2">
        Guardar
      </Button>
    </form>
  );
}
