import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import fondoPrincipal from "../../static/fondo-principal.jpg";
import fondoPrincipal2 from "../../static/fondo-principal2.jpg";
import fondoPrincipal3 from "../../static/fondo-principal3.jpg";
import * as fetch from "../../helpers/fetch";
import * as styles from "../../helpers/styles";
import * as toast from "../../helpers/toast";
import * as url from "../../helpers/urls";
import { Redirect, useHistory } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import { OrderContext } from "../../Context/OrderContext";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => {
  const fondos = [fondoPrincipal, fondoPrincipal2, fondoPrincipal3];
  return styles.loginStyles(
    theme,
    fondos[Math.floor(Math.random() * fondos.length)],
  );
});

function Login() {
  const classes = useStyles();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [user, setUser] = useContext(UserContext);
  const [orden, setOrden] = useContext(OrderContext);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (user !== null && orden !== null) {
      setUser(null);
      setOrden(null);
    }
    if (username.length === 0)
      return toast.errorToast("Usuario no puede ir vacio!");
    if (password.length === 0)
      return toast.errorToast("Contraseña no puede ir vacio!");

    const body = JSON.stringify({
      username: username,
      password: password,
    });

    const loginService = url.loginServiceUrl();
    const header = fetch.requestHeader("POST", body, "");

    setIsLoading(true);

    const loggedInfo = await fetch.fetchData(loginService, header);
    if (loggedInfo.accessToken) {
      localStorage.setItem("token", loggedInfo.accessToken);
      localStorage.setItem("refresh_token", loggedInfo.refreshToken);

      const getUserData = url.getUserUrl();
      const headerGetData = fetch.requestHeader(
        "GET",
        null,
        loggedInfo.accessToken,
      );
      const userdata = await fetch.fetchData(getUserData, headerGetData);
      setUser({
        user_id: userdata[0].user_id,
        name: userdata[0].name,
        lastname: userdata[0].lastname,
        email: userdata[0].correo_electronico,
        number: userdata[0].contact_number,
        id_pais: userdata[0].id_pais,
        address: userdata[0].address,
        pais: userdata[0].pais,
        estado: userdata[0].estado,
        rol: userdata[0].rol,
        username: userdata[0].username,
      });
      setOrden({
        id_pedido: null,
        productos: [],
        nombre_cliente: `${userdata[0].name} ${userdata[0].lastname}`,
        numero_cliente: userdata[0].contact_number,
        direccion_cliente: userdata[0].address,
      });

      if (userdata[0].estado === 0)
        return toast.msgWarn("Usuario desactivado.");
      history.push("/");
    } else if (loggedInfo === "conexion error") {
      toast.msgWarn("Verifique su conexion a internet.");
    } else {
      toast.errorToast(loggedInfo);
    }

    setIsLoading(false);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <Helmet title="Iniciar sesión" />
      {localStorage.token && <Redirect to="/" />}
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            CELISASTORE BILLING
          </Typography>
          <form className={classes.form} onSubmit={handleOnSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Usuario"
              autoComplete="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
              name="username"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {isLoading ? (
              <BackdropSpinner isLoading={!isLoading} />
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Entrar
              </Button>
            )}
            <Box mt={5}>
              <styles.Copyright name="Anthony Cardoze" />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default Login;
