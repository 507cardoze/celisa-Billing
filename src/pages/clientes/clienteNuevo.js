import React, { useState, useEffect, useContext, memo } from "react";
import clsx from "clsx";
import * as styles from "../../helpers/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import * as toast from "../../helpers/toast";
import BackdropSpinner from "../../components/BackDrop/backDrop";

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));

function CrearCliente({ className, ...rest }) {
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useContext(UserContext);
  const [paises, setPaises] = useState([]);
  const [userData, setUserData] = useState({
    nombre: "",
    direccion: "",
    numero: "+507",
    id_pais: null,
    observacion: "",
  });

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (!userData.nombre.trim().length > 0)
      return toast.errorToast("Nombre no puede ir vacio!");
    if (!userData.direccion.trim().length > 0)
      return toast.errorToast("Apellido no puede ir vacio!");
    if (!userData.numero.trim().length > 0)
      return toast.errorToast("Correo electrónico no puede ir vacio!");
    if (!userData.id_pais) return toast.errorToast("Pais no puede ir vacio!");

    const body = JSON.stringify(userData);

    const header = fetch.requestHeader("POST", body, localStorage.token);
    const getClientDetails = url.getClientDetails();

    setIsLoading(true);
    fetch.UserRedirect(user, history);
    const loggedInfo = await fetch.fetchData(getClientDetails, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "Cliente Creado.") {
      history.push("/clientes");
      toast.msgSuccess("Cliente Creado.");
    } else {
      toast.errorToast("error al crear usuario");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetch.UserRedirect(user, history);
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const getPaisData = url.getPaisesUrl();
    const fetchData = async (url, header, setter) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
      setIsLoading(false);
    };
    fetchData(getPaisData, header, setPaises);
  }, [user, history]);

  return (
    <>
      <BackdropSpinner isLoading={!isLoading} />
      <Button
        variant="contained"
        color="primary"
        style={{ margin: "10px" }}
        onClick={() => {
          history.push(`/clientes`);
        }}
      >
        Atras
      </Button>
      <form
        autoComplete="off"
        noValidate
        className={clsx(classes.root, className)}
        {...rest}
        onSubmit={handleOnSubmit}
      >
        <Card>
          <CardHeader
            subheader="Ingrese la información del cliente"
            title="Crear Cliente"
          />
          <Divider />
          {userData && (
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    helperText="Por favor especifique el nombre"
                    label="Nombre completo"
                    name="nombre"
                    onChange={handleChange}
                    required
                    value={userData.nombre}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    name="direccion"
                    onChange={handleChange}
                    required
                    value={userData.direccion}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Número de teléfono"
                    name="numero"
                    onChange={handleChange}
                    type="text"
                    value={userData.numero}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl item>
                    <Select
                      variant="outlined"
                      fullWidth
                      value={userData.id_pais}
                      onChange={handleChange}
                      inputProps={{
                        name: "id_pais",
                      }}
                    >
                      {paises?.map((pais) => (
                        <MenuItem key={pais.pais_id} value={pais.pais_id}>
                          {pais.pais}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Seleccione un pais.</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item md={10} xs={12}>
                  <TextField
                    fullWidth
                    label="Observación"
                    name="observacion"
                    onChange={handleChange}
                    type="text"
                    value={userData.observacion}
                    variant="outlined"
                    multiline={3}
                  />
                </Grid>
              </Grid>
            </CardContent>
          )}
          <Divider />
          <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
            alignItems="center"
          >
            {/* <Button
              variant="contained"
              color="default"
              style={{ margin: "5px" }}
            >
              Eliminar Cliente
            </Button> */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: "5px" }}
            >
              Guardar Detalles
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
}

export default memo(CrearCliente);
