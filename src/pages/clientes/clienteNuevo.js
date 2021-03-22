import React, { useState, useEffect, useContext, memo } from "react";
import clsx from "clsx";
import * as styles from "../../helpers/styles";
import { Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import * as toast from "../../helpers/toast";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import NewClientForm from "./newClientForm";

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));

function CrearCliente({ className }) {
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
      history.push("/clientes/crear");
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
        onClick={() => history.push(`/clientes`)}
      >
        Atras
      </Button>
      <Button
        variant="contained"
        color="default"
        style={{ margin: "10px" }}
        onClick={() => history.push(`/create-orders`)}
      >
        Volver a la orden
      </Button>
      <NewClientForm
        className={clsx(classes.root, className)}
        handleOnSubmit={handleOnSubmit}
        handleChange={handleChange}
        userData={userData}
        paises={paises}
      />
    </>
  );
}

export default memo(CrearCliente);
