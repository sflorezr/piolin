"use client";

import { SubmitButton } from "@/components/ui/submit-button";

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
      <SubmitButton variant="destructive" size="sm" pendingText="Eliminando...">
        Eliminar reporte
      </SubmitButton>
    </form>
  );
}
