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
import EditClientForm from "./EditClientForm";
import EditarRevendedora from "./EditarRevendedora";

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));

function EditCliente({ className, match }) {
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

  const handleChange = (event) =>
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });

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
      try {
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
      } catch (error) {
        console.log(error);
      }
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
      <EditClientForm
        className={clsx(classes.root, className)}
        handleOnSubmit={handleOnSubmit}
        userData={userData}
        handleChange={handleChange}
        paises={paises}
      />
      <EditarRevendedora
        className={clsx(classes.root, className)}
        handleOnSubmitRevendedora={handleOnSubmitRevendedora}
        userData={userData}
        selectedUsuario={selectedUsuario}
        setSelectedUsuario={setSelectedUsuario}
        usuarios={usuarios}
        selectedAdmin={selectedAdmin}
        setSelectedAdmin={setSelectedAdmin}
      />
    </>
  );
}

export default memo(EditCliente);
