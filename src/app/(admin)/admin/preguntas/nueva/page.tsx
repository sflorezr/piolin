import { crearPregunta } from "@/lib/actions/preguntas";
import { PreguntaForm } from "@/components/preguntas/pregunta-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NuevaPreguntaPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-neutral-900">Nueva pregunta</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Datos de la pregunta</CardTitle>
        </CardHeader>
        <CardContent>
          <PreguntaForm action={crearPregunta} />
        </CardContent>
      </Card>
    </div>
  );
}
