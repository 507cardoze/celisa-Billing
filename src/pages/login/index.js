import React, { useState, useContext, memo, useEffect } from "react";
import { Paper, Grid, Typography, makeStyles } from "@material-ui/core";
import fondoPrincipal from "../../static/fondo-principal.jpg";
import * as fetch from "../../helpers/fetch";
import * as styles from "../../helpers/styles";
import * as toast from "../../helpers/toast";
import * as url from "../../helpers/urls";
import { Redirect, useHistory } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import { OrderContext } from "../../Context/OrderContext";
import { Helmet } from "react-helmet";
import LoginForm from "./LoginForm";

function Login() {
  const useStyles = makeStyles((theme) =>
    styles.loginStyles(theme, fondoPrincipal),
  );
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

    setIsLoading(true);

    const body = JSON.stringify({
      username: username,
      password: password,
    });

    const loginService = url.loginServiceUrl();
    const header = fetch.requestHeader("POST", body, "");
    const loggedInfo = await fetch.fetchData(loginService, header);

    if (loggedInfo.accessToken) {
      localStorage.setItem("token", loggedInfo.accessToken);
      localStorage.setItem("refresh_token", loggedInfo.refreshToken);

      const getUserData = url.getUserUrl();
      const verifyUrl = url.verifyLoggedUser();
      const headerGetData = fetch.requestHeader(
        "GET",
        null,
        loggedInfo.accessToken,
      );

      const userdata = await fetch.fetchData(getUserData, headerGetData);

      if (userdata[0].estado === 0)
        return toast.msgWarn("Usuario desactivado.");

      switch (userdata[0].rol) {
        case "Administrador":
          setOrden({
            id_pedido: null,
            id_cliente: null,
            productos: [],
            nombre_cliente: "",
            numero_cliente: "",
            direccion_cliente: "",
          });
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
            id_cliente: null,
          });
          break;
        default:
          const cliente_id = await fetch.fetchData(verifyUrl, headerGetData);
          setOrden({
            id_pedido: null,
            id_cliente: cliente_id,
            productos: [],
            nombre_cliente: `${userdata[0].name} ${userdata[0].lastname}`,
            numero_cliente: userdata[0].contact_number,
            direccion_cliente: userdata[0].address,
          });
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
            id_cliente: cliente_id,
          });
          break;
      }

      history.push("/");
    } else if (loggedInfo === "conexion error") {
      toast.msgWarn("Verifique su conexion a internet.");
    } else {
      toast.errorToast(loggedInfo);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    localStorage.clear();

    return () => {
      setUserName("");
      setPassword("");
      setIsLoading(false);
    };
  }, []);

  return (
    <Grid container component="main" className={classes.root}>
      <Helmet title="Iniciar sesión" />
      {localStorage.token && localStorage.user && <Redirect to="/" />}
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            CelisaStore Billing
          </Typography>
          <LoginForm
            className={classes}
            handleOnSubmit={handleOnSubmit}
            username={username}
            setUserName={setUserName}
            password={password}
            setPassword={setPassword}
            isLoading={isLoading}
          />
        </div>
      </Grid>
    </Grid>
  );
}

export default memo(Login);
