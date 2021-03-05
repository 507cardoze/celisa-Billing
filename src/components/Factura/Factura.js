import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const LinkWrapperPDF = ({ document }) => (
  <PDFDownloadLink document={document} fileName="somename.pdf">
    {({ blob, url, loading, error }) =>
      loading ? "Loading document..." : "Download now!"
    }
  </PDFDownloadLink>
);

function FacturaDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
}

function Factura() {
  return <LinkWrapperPDF document={<FacturaDocument />} />;
}

export default Factura;