import React, { useContext, useState, useEffect, memo } from "react";
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Button,
} from "@material-ui/core";
import { OrderContext } from "../../Context/OrderContext";
import { UserContext } from "../../Context/userContext";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import BackdropSpinner from "../BackDrop/backDrop";
import { useHistory } from "react-router-dom";

function ClientDataForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [orden, setOrden] = useContext(OrderContext);
  const [user] = useContext(UserContext);
  const history = useHistory();
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const getClientsUrl = url.getClientes();
    const fetchData = async (url, header, setter) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
      setIsLoading(false);
    };
    fetchData(getClientsUrl, header, setClientes);
  }, [user, history]);

  return (
    <Grid container xs={12} md={12} lg={12}>
      <BackdropSpinner isLoading={!isLoading} />
      <Grid item xs={12} md={4} lg={4}>
        <FormControl item>
          <Select
            variant="outlined"
            fullWidth
            value={orden.id_cliente}
            onChange={(e) => {
              const clienteData = clientes.find(
                (cliente) => cliente.cliente_id === parseInt(e.target.value),
              );
              setOrden({
                ...orden,
                id_cliente: parseInt(e.target.value),
                nombre_cliente: clienteData.nombre,
                numero_cliente: clienteData.numero,
                direccion_cliente: clienteData.direccion,
              });
            }}
            inputProps={{
              name: "clienteId",
            }}
            disabled={user.rol === "Administrador" ? false : true}
          >
            {clientes?.map((cliente) => (
              <MenuItem key={cliente.cliente_id} value={cliente.cliente_id}>{`${
                cliente.nombre
              } ${
                cliente.observacion.length > 0 ? cliente.observacion : ""
              }`}</MenuItem>
            ))}
          </Select>
          {user.rol === "Administrador" && (
            <>
              <FormHelperText>Listado de clientes.</FormHelperText>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "10px" }}
                onClick={() => {
                  history.push(`/clientes/crear`);
                }}
              >
                Crear Cliente
              </Button>
            </>
          )}
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default memo(ClientDataForm);
