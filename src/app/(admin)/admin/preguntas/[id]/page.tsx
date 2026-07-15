import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { actualizarPregunta } from "@/lib/actions/preguntas";
import { PreguntaForm } from "@/components/preguntas/pregunta-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditarPreguntaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pregunta = await prisma.pregunta.findUnique({ where: { id } });

  if (!pregunta) notFound();

  const actualizar = actualizarPregunta.bind(null, pregunta.id);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-neutral-900">Editar pregunta</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Datos de la pregunta</CardTitle>
        </CardHeader>
        <CardContent>
          <PreguntaForm
            action={actualizar}
            valoresIniciales={{
              texto: pregunta.texto,
              tipo: pregunta.tipo,
              opciones: pregunta.opciones,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
