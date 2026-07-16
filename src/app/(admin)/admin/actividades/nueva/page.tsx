import { crearActividad } from "@/lib/actions/actividades";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackLink } from "@/components/ui/back-link";

export default function NuevaActividadPage() {
  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/admin/actividades" className="mb-4" />
      <h1 className="text-2xl font-semibold text-neutral-900">Nueva actividad</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Datos de la actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={crearActividad} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" placeholder="Ej. Motricidad fina" required />
            </div>
            <Button type="submit" className="mt-2">
              Guardar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
