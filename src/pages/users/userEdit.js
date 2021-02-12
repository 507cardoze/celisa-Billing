import React, { useState, useEffect, useContext, memo } from "react";
import { Container, Grid, Box } from "@material-ui/core";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import ProfileDetails from "../profile/profileDetails";
import Password from "../profile/password";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import * as toast from "../../helpers/toast";
import BackButton from "../../components/BackButton/BackButton";

const UsersEdit = ({ match }) => {
  // state
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState({});
  const [passwords, setPasswords] = useState({
    password: "",
    confirm_password: "",
  });
  const [paises, setPaises] = useState([]);
  const history = useHistory();
  const [user] = useContext(UserContext);
  const { id } = match.params;
  const getUsersURL = url.getUserByIdUrl();
  const getPaisData = url.getPaisesUrl();
  const headerGetData = fetch.requestHeader("GET", null, localStorage.token);

  //funciones

  const fetchData = async (url, header, setter) => {
    const loggedInfo = await fetch.fetchData(url, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    setter(loggedInfo);
  };

  const fetchUserData = async (url, header, setter) => {
    const loggedInfo = await fetch.fetchData(url, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    setter({
      user_id: parseInt(id),
      name: loggedInfo[0].name,
      lastname: loggedInfo[0].lastname,
      email: loggedInfo[0].correo_electronico,
      number: loggedInfo[0].contact_number,
      id_pais: loggedInfo[0].id_pais,
      address: loggedInfo[0].address,
      pais: loggedInfo[0].pais,
      estado: loggedInfo[0].estado,
      rol: loggedInfo[0].rol,
      username: loggedInfo[0].username,
    });
  };

  const handleChange = (event) => {
    setRows({
      ...rows,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangePassword = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value,
    });
  };

  const handleOnSubmitPassword = async (event) => {
    event.preventDefault();

    if (!passwords.password)
      return toast.errorToast("contraseña no puede ir vacia!");
    if (passwords.password !== passwords.confirm_password)
      return toast.errorToast("Contraseña no coinciden!");

    const body = JSON.stringify({
      user_id: parseInt(id),
      password: passwords.password,
    });

    const header = fetch.requestHeader("POST", body, localStorage.token);
    const changeServiceUrl = url.resetPasswordUrl();

    setIsLoading(true);

    const loggedInfo = await fetch.fetchData(changeServiceUrl, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "Contraseña cambiada con exito.") {
      setPasswords({
        password: "",
        confirm_password: "",
      });
      toast.msgSuccess(loggedInfo);
    } else {
      toast.errorToast("error al cambiar la contraseña.");
    }

    setIsLoading(false);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (!rows.name) return toast.errorToast("Nombre no puede ir vacio!");
    if (!rows.lastname) return toast.errorToast("Apellido no puede ir vacio!");
    if (!rows.email)
      return toast.errorToast("Correo electrónico no puede ir vacio!");
    if (!rows.id_pais) return toast.errorToast("Pais no puede ir vacio!");
    if (!rows.address) return toast.errorToast("Dirección no puede ir vacia!");

    const body = JSON.stringify({
      name: rows.name,
      lastname: rows.lastname,
      email: rows.email,
      number: rows.number,
      id_pais: rows.id_pais,
      address: rows.address,
      user_id: id,
      rol: rows.rol,
    });

    const header = fetch.requestHeader("PUT", body, localStorage.token);
    const updateServiceUrl = url.updateUserDetailsUrl();

    setIsLoading(true);

    const loggedInfo = await fetch.fetchData(updateServiceUrl, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "Detalles Actualizados.") {
      fetchUserData(`${getUsersURL}?user_id=${id}`, headerGetData, setRows);
      fetchData(getPaisData, headerGetData, setPaises);
      toast.msgSuccess("Detalles Actualizados.");
    } else {
      toast.errorToast("error al actualizar los datos.");
    }

    setIsLoading(false);
  };

  //efectos

  useEffect(() => {
    fetch.UserRedirect(user, history);
    const getUsersURL = url.getUserByIdUrl();
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const headerGetData = fetch.requestHeader("GET", null, localStorage.token);
    const fetchData = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter({
        user_id: parseInt(id),
        name: loggedInfo[0].name,
        lastname: loggedInfo[0].lastname,
        email: loggedInfo[0].correo_electronico,
        number: loggedInfo[0].contact_number,
        id_pais: loggedInfo[0].id_pais,
        address: loggedInfo[0].address,
        pais: loggedInfo[0].pais,
        estado: loggedInfo[0].estado,
        rol: loggedInfo[0].rol,
        username: loggedInfo[0].username,
      });
    };
    const fetchDataPaises = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
    };
    setIsLoading(true);
    fetchData(`${getUsersURL}?user_id=${id}`, header, setRows);
    fetchDataPaises(getPaisData, headerGetData, setPaises);
    setIsLoading(false);
  }, [user, history, id, getPaisData]);

  return (
    <MainLayout Tittle={rows ? `Editar ${rows.username}` : ""}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Box display="flex" justifyContent="flex-end" p={2}>
            <BackButton texto="Atras" ruta="/users" />
          </Box>
          <Grid item lg={12} md={12} xs={12}>
            {rows?.user_id ? (
              <>
                <ProfileDetails
                  userDetails={rows}
                  paises={paises}
                  handleChange={handleChange}
                  handleOnSubmit={handleOnSubmit}
                  isLoading={isLoading}
                  permiso
                />
                <Box mt={3}>
                  <Password
                    passwords={passwords}
                    handleChangePassword={handleChangePassword}
                    handleOnSubmitPassword={handleOnSubmitPassword}
                  />
                </Box>
              </>
            ) : (
              <BackdropSpinner isLoading={isLoading} />
            )}
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default memo(UsersEdit);
