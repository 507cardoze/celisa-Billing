import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Button,
} from "@material-ui/core";

import * as fetch from "../../helpers/fetch";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import BackdropSpinner from "../BackDrop/backDrop";

function ReporteSelector({
  selectedData,
  setSelectedData,
  handleBuscar,
  url,
  label,
  name,
  helperText,
  type,
}) {
  const history = useHistory();
  const header = fetch.requestHeader("GET", null, localStorage.token);

  const fetchData = async (url, header) => {
    const res = await window.fetch(url, header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const { isLoading, isError, data, error } = useQuery(
    [type, url],
    () => fetchData(url, header),
    {
      staleTime: 180000,
    },
    header,
  );

  const getCorrectLoop = (type, data) => {
    switch (type) {
      case "usuarios":
        return data.map((vendedor) => (
          <MenuItem value={vendedor.user_id} key={vendedor.user_id}>
            {`${vendedor.name} ${vendedor.lastname}`}
          </MenuItem>
        ));
      case "clientes":
        return data.map((cliente) => (
          <MenuItem value={cliente.cliente_id} key={cliente.cliente_id}>
            {cliente.nombre}
          </MenuItem>
        ));
      case "proveedores":
        return data.map((proveedores) => (
          <MenuItem
            value={proveedores.proveedor_id}
            key={proveedores.proveedor_id}
          >
            {proveedores.proveedor}
          </MenuItem>
        ));
      default:
        return "Error";
    }
  };

  return (
    <FormControl
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        flexDirection: "column",
        width: "300px",
        height: "150px",
      }}
    >
      {isLoading ? (
        <BackdropSpinner isLoading={false} />
      ) : (
        <>
          <InputLabel>{label}</InputLabel>
          <Select
            value={selectedData}
            onChange={(e) => setSelectedData(parseInt(e.target.value))}
            inputProps={{
              name: { name },
            }}
          >
            <MenuItem value={0}>
              <em>Todos</em>
            </MenuItem>
            {getCorrectLoop(type, data)}
          </Select>
          <FormHelperText>{helperText}</FormHelperText>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleBuscar(type, selectedData)}
            style={{ fontWeight: "bold" }}
          >
            Buscar
          </Button>
        </>
      )}
      {isError && <h3>{`ERROR: ${error}`}</h3>}
    </FormControl>
  );
}

export default ReporteSelector;
