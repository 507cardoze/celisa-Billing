import React, { useContext, useState, useEffect, memo } from "react";
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { OrderContext } from "../../Context/OrderContext";
import { UserContext } from "../../Context/userContext";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import { useHistory } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import BackdropSpinner from "../../components/BackDrop/backDrop";

function ClientDataForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [orden, setOrden] = useContext(OrderContext);
  const [user] = useContext(UserContext);
  const history = useHistory();
  const [clientes, setClientes] = useState([]);
  const [searchField, setSearchField] = useState("");

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
    <Grid container spacing={2}>
      <BackdropSpinner isLoading={!isLoading} />
      <Grid item xs={12} md={4} lg={4}>
        <FormControl style={{ marginTop: ".5rem" }}>
          {user.rol === "Administrador" ? (
            <TextField
              value={searchField}
              label="Buscar clientes"
              style={{ marginBottom: "1rem", width: 300 }}
              onChange={(e) => setSearchField(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          ) : null}
          <Select
            variant="outlined"
            fullWidth
            value={orden.id_cliente ? orden.id_cliente : ""}
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
            {clientes
              ?.filter((cliente) =>
                cliente.nombre
                  .toLowerCase()
                  .includes(searchField.toLowerCase()),
              )
              .map((cliente) => (
                <MenuItem
                  key={cliente.cliente_id}
                  value={cliente.cliente_id}
                >{`${cliente.nombre} ${
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
                style={{ margin: "0.5rem" }}
                onClick={() => history.push(`/clientes/crear`)}
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
