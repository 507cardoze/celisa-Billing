import React, { memo } from "react";
import { Grid, Container } from "@material-ui/core";
import BackButton from "../../components/BackButton/BackButton";
import { Redirect } from "react-router-dom";
import DashboardGeneralVentas from "../../components/DashboardGeneralVentas/DashboardGeneralVentas";
import ProveedoresDashboard from "../../components/ProveedoresDashboard/ProveedoresDashboard";
import VendedoresDashboard from "../../components/VendedoresDashboard/VendedoresDashboard";
import moment from "moment";

function ReportePreview({ match }) {
  const { desde, hasta, type, data } = match.params;

  const getTypeDataSelector = (type, desde, hasta, data) => {
    switch (type) {
      case "usuarios":
        return (
          <VendedoresDashboard desde={desde} hasta={hasta} id_vendedor={data} />
        );
      case "clientes":
        return alert(data);
      case "proveedores":
        return (
          <ProveedoresDashboard
            desde={desde}
            hasta={hasta}
            id_proveedor={data}
          />
        );
      case "ventas":
        return (
          <DashboardGeneralVentas
            desde={desde}
            hasta={hasta}
            ventas
            proveedores
            vendedores
            desglose
            modulos
          />
        );
      default:
        return <Redirect to="/reportes" />;
    }
  };

  return (
    <Container spacing={5} maxWidth={false}>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        container
      >
        <BackButton
          texto="Seleccionar otro tipo de reporte"
          style={{ marginRight: "0.5rem" }}
          ruta={`/reportes`}
        />
        <BackButton
          texto="Atras"
          ruta={`/reportes/buscar/${match.params.type}`}
          style={{ marginRight: "0.5rem" }}
        />
        <div style={{ flexGrow: 1 }}></div>
        <div>{`Reporte: ${moment(desde).format("DD-MMM-YYYY")} a ${moment(
          hasta,
        ).format("DD-MMM-YYYY")}`}</div>
      </Grid>
      {getTypeDataSelector(type, desde, hasta, data)}
    </Container>
  );
}

export default memo(ReportePreview);
