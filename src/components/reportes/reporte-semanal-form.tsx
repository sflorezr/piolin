"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Actividad = { id: string; nombre: string };

export function ReporteSemanalForm({
  action,
  actividades,
}: {
  action: (formData: FormData) => void;
  actividades: Actividad[];
}) {
  const [filas, setFilas] = useState([{ actividadId: actividades[0]?.id ?? "", observacion: "" }]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fechaInicio">Desde</Label>
          <Input id="fechaInicio" name="fechaInicio" type="date" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fechaFin">Hasta</Label>
          <Input id="fechaFin" name="fechaFin" type="date" required />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Actividades de la semana</Label>
        {filas.map((fila, indice) => (
          <div key={indice} className="flex flex-col gap-2 rounded-md border border-neutral-200 p-3">
            <div className="flex items-center gap-2">
              <Select
                name="actividadId"
                value={fila.actividadId}
                onChange={(event) => {
                  const nuevas = [...filas];
                  nuevas[indice] = { ...nuevas[indice], actividadId: event.target.value };
                  setFilas(nuevas);
                }}
                className="flex-1"
              >
                {actividades.map((actividad) => (
                  <option key={actividad.id} value={actividad.id}>
                    {actividad.nombre}
                  </option>
                ))}
              </Select>
              {filas.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilas(filas.filter((_, i) => i !== indice))}
                >
                  Quitar
                </Button>
              )}
            </div>
            <Textarea
              name="observacion"
              placeholder="Observación de la profesora"
              value={fila.observacion}
              onChange={(event) => {
                const nuevas = [...filas];
                nuevas[indice] = { ...nuevas[indice], observacion: event.target.value };
                setFilas(nuevas);
              }}
              required
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() =>
            setFilas([...filas, { actividadId: actividades[0]?.id ?? "", observacion: "" }])
          }
        >
          Agregar actividad
        </Button>
      </div>

      <Button type="submit" className="mt-2">
        Guardar reporte
      </Button>
    </form>
  );
}
