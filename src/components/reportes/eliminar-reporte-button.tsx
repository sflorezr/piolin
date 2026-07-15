"use client";

import { Button } from "@/components/ui/button";

export function EliminarReporteButton({ action }: { action: () => void }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm("¿Seguro que quieres eliminar este reporte semanal? Esta acción no se puede deshacer.")) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive" size="sm">
        Eliminar reporte
      </Button>
    </form>
  );
}
