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

function EditCliente({ className, match, ...rest }) {
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useContext(UserContext);
  const [paises, setPaises] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [userData, setUserData] = useState(null);

  const [selectedUsuario, setSelectedUsuario] = useState();
  const [selectedAdmin, setSelectedAdmin] = useState();
  const cliente_id = match.params.cliente_id;

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (!userData.nombre) return toast.errorToast("Nombre no puede ir vacio!");
    if (!userData.direccion)
      return toast.errorToast("Apellido no puede ir vacio!");
    if (!userData.numero)
      return toast.errorToast("Correo electrónico no puede ir vacio!");
    if (!userData.id_pais) return toast.errorToast("Pais no puede ir vacio!");

    const body = JSON.stringify(userData);

    const header = fetch.requestHeader("PUT", body, localStorage.token);
    const getClientDetails = url.getClientDetails();

    setIsLoading(true);
    fetch.UserRedirect(user, history);
    const loggedInfo = await fetch.fetchData(getClientDetails, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "Detalles Actualizados.") {
      toast.msgSuccess("Detalles Actualizados.");
    } else {
      toast.errorToast("error al actualizar los datos.");
    }

    setIsLoading(false);
  };

  const handleOnSubmitRevendedora = async (event) => {
    event.preventDefault();

    const body = JSON.stringify({
      selectedUsuario,
      selectedAdmin,
      id_cliente: cliente_id,
    });

    const header = fetch.requestHeader("PUT", body, localStorage.token);

    const getClientRevURL = url.getClientRevendora();

    setIsLoading(true);
    fetch.UserRedirect(user, history);
    const loggedInfo = await fetch.fetchData(getClientRevURL, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "Detalles Actualizados.") {
      toast.msgSuccess("Detalles Actualizados.");
    } else {
      toast.errorToast("error al actualizar los datos.");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetch.UserRedirect(user, history);
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const getPaisData = url.getPaisesUrl();
    const getAllusersURL = url.getAllUsersUrl();
    const getClientDetails = url.getClientDetails();
    const fetchData = async (url, header, setter) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
      setIsLoading(false);
    };
    const fetchUserData = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter({
        id_cliente: loggedInfo[0].cliente_id,
        nombre: loggedInfo[0].nombre,
        direccion: loggedInfo[0].direccion,
        id_pais: loggedInfo[0].id_pais,
        pais: loggedInfo[0].pais,
        observacion: loggedInfo[0].observacion,
        numero: loggedInfo[0].numero,
        user_id: loggedInfo[0].user_id,
        is_admin: loggedInfo[0].id_admin,
      });
      setSelectedUsuario(loggedInfo[0].user_id);
      setSelectedAdmin(loggedInfo[0].id_admin);
    };
    fetchData(getPaisData, header, setPaises);
    fetchData(getAllusersURL, header, setUsuarios);
    fetchUserData(
      `${getClientDetails}?cliente_id=${cliente_id}`,
      header,
      setUserData,
    );
  }, [user, history, cliente_id]);

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
        <Card raised>
          <CardHeader
            subheader="La información del cliente se puede editar"
            title="Editar Cliente"
          />
          <Divider />
          {userData && (
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    helperText="Por favor especifique el nombre"
                    label="Nombre"
                    name="nombre"
                    onChange={handleChange}
                    required
                    value={userData?.nombre}
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
                    value={userData?.direccion}
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
                    value={userData?.numero}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl>
                    <Select
                      variant="outlined"
                      fullWidth
                      value={userData?.id_pais}
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
                    label="Observacion"
                    name="observacion"
                    onChange={handleChange}
                    type="text"
                    value={userData?.observacion}
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
      <form
        autoComplete="off"
        noValidate
        className={clsx(classes.root, className)}
        {...rest}
        onSubmit={handleOnSubmitRevendedora}
        style={{ marginTop: "1rem" }}
      >
        <Card raised>
          <CardHeader
            subheader="Se puede asignar revendedora a un usuario en particular"
            title="Asignar Revendedora"
          />
          <Divider />
          {userData && (
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <FormControl>
                    <Select
                      variant="outlined"
                      fullWidth
                      value={selectedUsuario ? selectedUsuario : 0}
                      onChange={(e) =>
                        setSelectedUsuario(parseInt(e.target.value))
                      }
                      disabled={
                        process.env.NODE_ENV === "development" ? false : true
                      }
                    >
                      <MenuItem value={0}>Sin asignar</MenuItem>
                      {usuarios?.map((user) => (
                        <MenuItem key={user.user_id} value={user.user_id}>
                          {`${user.name} ${user.lastname} - ${user.username}`}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      A que usuario pertenece este cliente.
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl>
                    <Select
                      variant="outlined"
                      fullWidth
                      value={selectedAdmin ? selectedAdmin : 0}
                      onChange={(e) =>
                        setSelectedAdmin(parseInt(e.target.value))
                      }
                    >
                      <MenuItem value={0}>Sin asignar</MenuItem>
                      {usuarios?.map((user) => (
                        <MenuItem key={user.user_id} value={user.user_id}>
                          {`${user.name} ${user.lastname}`}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      A que usuario pertenece este revendedor
                    </FormHelperText>
                  </FormControl>
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: "5px" }}
            >
              Actualizar Datos
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
}

export default memo(EditCliente);
