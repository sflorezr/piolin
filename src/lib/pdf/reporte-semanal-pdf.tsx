import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

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
  footer: { marginTop: 20, fontSize: 9, color: "#a3a3a3" },
});

type ReporteParaPdf = {
  ninoNombre: string;
  grupoDescripcion: string;
  fotoUrl: string | null;
  rangoSemana: string;
  profesoraNombre: string;
  observaciones: { actividadNombre: string; observacion: string }[];
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
          <View key={indice} style={styles.seccion}>
            <Text style={styles.actividad}>{obs.actividadNombre}</Text>
            <Text style={styles.observacion}>{obs.observacion}</Text>
          </View>
        ))}

        <Text style={styles.footer}>Generado por Piolin</Text>
      </Page>
    </Document>
  );
}
