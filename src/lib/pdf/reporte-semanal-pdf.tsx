import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { formatearFecha } from "@/lib/utils";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: "Helvetica" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  foto: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  titulo: { fontSize: 16, fontWeight: 700 },
  subtitulo: { fontSize: 10, color: "#525252", marginTop: 2 },
  seccion: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    borderBottomStyle: "solid",
  },
  actividad: { fontSize: 12, fontWeight: 700, marginBottom: 4 },
  observacion: { fontSize: 11, color: "#404040", lineHeight: 1.4 },
  fotoActividad: { width: 220, height: 165, objectFit: "cover", borderRadius: 4, marginTop: 8 },
  footer: { marginTop: 20, fontSize: 9, color: "#a3a3a3" },
});

type ReporteParaPdf = {
  ninoNombre: string;
  grupoDescripcion: string;
  fotoUrl: string | null;
  rangoSemana: string;
  profesoraNombre: string;
  observaciones: { actividadNombre: string; observacion: string; fotoUrl: string | null }[];
};

export function ReporteSemanalPdf({
  ninoNombre,
  grupoDescripcion,
  fotoUrl,
  rangoSemana,
  profesoraNombre,
  observaciones,
}: ReporteParaPdf) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image, not an <img> */}
          {fotoUrl && <Image src={fotoUrl} style={styles.foto} />}
          <View>
            <Text style={styles.titulo}>Reporte semanal — {ninoNombre}</Text>
            <Text style={styles.subtitulo}>{grupoDescripcion}</Text>
            <Text style={styles.subtitulo}>Semana: {rangoSemana}</Text>
            <Text style={styles.subtitulo}>Profesora: {profesoraNombre}</Text>
          </View>
        </View>

        {observaciones.map((obs, indice) => (
          <View key={indice} style={styles.seccion} wrap={false}>
            <Text style={styles.actividad}>{obs.actividadNombre}</Text>
            <Text style={styles.observacion}>{obs.observacion}</Text>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image, not an <img> */}
            {obs.fotoUrl && <Image src={obs.fotoUrl} style={styles.fotoActividad} />}
          </View>
        ))}

        <Text style={styles.footer}>Generado por Piolin</Text>
      </Page>
    </Document>
  );
}

export async function generarBufferReporteSemanal(props: ReporteParaPdf): Promise<Buffer> {
  return renderToBuffer(<ReporteSemanalPdf {...props} />);
}

type ReporteConRelaciones = {
  fechaInicio: Date;
  fechaFin: Date;
  profesora: { nombre: string };
  nino: { nombre: string; fotoUrl: string | null; grupo: { descripcion: string } };
  observaciones: { actividad: { nombre: string }; observacion: string; fotoUrl: string | null }[];
};

export function construirPropsReportePdf(reporte: ReporteConRelaciones): ReporteParaPdf {
  return {
    ninoNombre: reporte.nino.nombre,
    grupoDescripcion: reporte.nino.grupo.descripcion,
    fotoUrl: reporte.nino.fotoUrl,
    rangoSemana: `${formatearFecha(reporte.fechaInicio)} — ${formatearFecha(reporte.fechaFin)}`,
    profesoraNombre: reporte.profesora.nombre,
    observaciones: reporte.observaciones.map((observacion) => ({
      actividadNombre: observacion.actividad.nombre,
      observacion: observacion.observacion,
      fotoUrl: observacion.fotoUrl,
    })),
  };
}
