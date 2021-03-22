import React, { useState } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import BackButton from "../../components/BackButton/BackButton";
import moment from "moment";
import { Redirect, useHistory } from "react-router-dom";
import * as url from "../../helpers/urls";
import { useStickyState } from "../../helpers/fetch";
//views
import ReporteSelector from "./ReporteSelector";

function ReporteContent({ match }) {
  const type = match.params.type;
  const [desdeReporte, setDesdeReporte] = useStickyState(
    moment().format("YYYY-MM-DD"),
    "desdeReporte",
  );
  const [hastaReporte, setHastaReporte] = useStickyState(
    moment().format("YYYY-MM-DD"),
    "hastaReporte",
  );
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedClient, setSelectedClient] = useState(0);
  const [selectedProveedor, setSelectedProveedor] = useState(0);
  const history = useHistory();
  const getClientsUrl = url.getClientes();
  const getVendedoresUrl = url.getAllUsersUrl();
  const getProveedoresUrl = url.getAllProveedoresUrl();

  const handleBuscar = (type, data) =>
    history.push(
      `/reportes/preview/${desdeReporte}/${hastaReporte}/${type}/${data}`,
    );

  const getTypeDataSelector = (type) => {
    switch (type) {
      case "usuarios":
        return (
          <ReporteSelector
            selectedData={selectedUser}
            setSelectedData={setSelectedUser}
            handleBuscar={handleBuscar}
            url={getVendedoresUrl}
            label="Seleccione el vendedor:"
            name="vendedor"
            helperText="Se mostrara la informacion del vendedor seleccionado."
            type={type}
          />
        );
      case "clientes":
        return (
          <ReporteSelector
            selectedData={selectedClient}
            setSelectedData={setSelectedClient}
            handleBuscar={handleBuscar}
            url={getClientsUrl}
            label="Seleccione el Cliente:"
            name="cliente"
            helperText="Se mostrara la informacion del cliente seleccionado."
            type={type}
          />
        );

      case "proveedores":
        return (
          <ReporteSelector
            selectedData={selectedProveedor}
            setSelectedData={setSelectedProveedor}
            handleBuscar={handleBuscar}
            url={getProveedoresUrl}
            label="Seleccione el proveedor:"
            name="proveedor"
            helperText="Se mostrara la informacion del proveedor seleccionado."
            type={type}
          />
        );
      case "ventas":
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleBuscar(type, "ventas")}
            style={{ fontWeight: "bold" }}
          >
            Buscar
          </Button>
        );
      default:
        return <Redirect to="/reportes" />;
    }
  };

  return (
    <Grid
      container
      spacing={5}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Grid item xs={12}>
        <BackButton texto="Atras" ruta={`/reportes`} />
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
        }}
        container
      >
        <TextField
          label="Desde"
          type="date"
          value={desdeReporte}
          style={{ margin: ".5rem" }}
          onChange={(e) => setDesdeReporte(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Hasta"
          type="date"
          value={hastaReporte}
          style={{ margin: ".5rem" }}
          onChange={(e) => setHastaReporte(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        container
      >
        {getTypeDataSelector(type)}
      </Grid>
    </Grid>
  );
}

export default ReporteContent;
