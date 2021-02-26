import React, { useState } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import BackButton from "../../components/BackButton/BackButton";
import moment from "moment";
import { Redirect } from "react-router-dom";
import * as url from "../../helpers/urls";

//views
import ReporteSelector from "../../components/ReporteSelector/ReporteSelector";

function ReporteContent({ match }) {
  const type = match.params.type;

  const [desde, setDesde] = useState(moment().format("YYYY-MM-DD"));
  const [hasta, setHasta] = useState(moment().format("YYYY-MM-DD"));
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedClient, setSelectedClient] = useState(0);
  const [selectedProveedor, setSelectedProveedor] = useState(0);

  const getClientsUrl = url.getClientes();
  const getVendedoresUrl = url.getAllUsersUrl();
  const getProveedoresUrl = url.getAllProveedoresUrl();

  const handleBuscar = (type, data) => {
    switch (type) {
      case "usuarios":
        return alert(`${data} ${type}`);
      case "clientes":
        return alert(`${data} ${type}`);
      case "proveedores":
        return alert(`${data} ${type}`);
      case "ventas":
        return alert(`${data} ${type}`);
      default:
        return "Error";
    }
  };

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
          value={desde}
          style={{ margin: ".5rem" }}
          onChange={(e) => setDesde(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Hasta"
          type="date"
          value={hasta}
          style={{ margin: ".5rem" }}
          onChange={(e) => setHasta(e.target.value)}
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
