import React, { useState, useEffect, useContext } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import { Container, Grid, Box } from "@material-ui/core";
import Profile from "./profile";
import ProfileDetails from "./profileDetails";
import Password from "./password";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import * as toast from "../../helpers/toast";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../Context/userContext";

function ProfilePage() {
  //state

  const [isLoading, setIsLoading] = useState(false);
  const [paises, setPaises] = useState([]);
  const [passwords, setPasswords] = useState({
    password: "",
    confirm_password: "",
  });
  const [user, setUser] = useContext(UserContext);

  //funciones

  const history = useHistory();
  const getUserData = url.getUserUrl();
  const getPaisData = url.getPaisesUrl();
  const headerGetData = fetch.requestHeader("GET", null, localStorage.token);

  const fetchUserData = async (url, header, setter) => {
    const loggedInfo = await fetch.fetchData(url, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    setter({
      user_id: loggedInfo[0].user_id,
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

  const fetchData = async (url, header, setter) => {
    const loggedInfo = await fetch.fetchData(url, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    setter(loggedInfo);
  };

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangePassword = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value,
    });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (!user.name) return toast.errorToast("Nombre no puede ir vacio!");
    if (!user.lastname) return toast.errorToast("Apellido no puede ir vacio!");
    if (!user.email)
      return toast.errorToast("Correo electrónico no puede ir vacio!");
    if (!user.id_pais) return toast.errorToast("Pais no puede ir vacio!");
    if (!user.address) return toast.errorToast("Dirección no puede ir vacia!");

    const body = JSON.stringify({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      number: user.number,
      id_pais: user.id_pais,
      address: user.address,
      user_id: user.user_id,
    });

    const header = fetch.requestHeader("PUT", body, localStorage.token);
    const updateServiceUrl = url.updateUserDetailsUrl();

    setIsLoading(true);

    const loggedInfo = await fetch.fetchData(updateServiceUrl, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "Detalles Actualizados.") {
      fetchUserData(getUserData, headerGetData, setUser);
      fetchData(getPaisData, headerGetData, setPaises);
      toast.msgSuccess("Detalles Actualizados.");
    } else {
      toast.errorToast("error al actualizar los datos.");
    }

    setIsLoading(false);
  };

  const handleOnSubmitPassword = async (event) => {
    event.preventDefault();

    if (!passwords.password)
      return toast.errorToast("contraseña no puede ir vacia!");
    if (passwords.password !== passwords.confirm_password)
      return toast.errorToast("Contraseña no coinciden!");

    const body = JSON.stringify({
      user_id: user.user_id,
      password: passwords.password,
    });

    const header = fetch.requestHeader("POST", body, localStorage.token);
    const resetServiceUrl = url.resetPasswordUrl();

    setIsLoading(true);

    const loggedInfo = await fetch.fetchData(resetServiceUrl, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "Contraseña cambiada con exito.") {
      setPasswords({
        password: "",
        confirm_password: "",
      });
      toast.msgSuccess("Contraseña cambiada con exito.");
    } else {
      toast.errorToast("error al cambiar la contraseña.");
    }

    setIsLoading(false);
  };

  //efectos

  useEffect(() => {
    const getUserData = url.getUserUrl();
    const getPaisData = url.getPaisesUrl();
    const header = fetch.requestHeader("GET", null, localStorage.token);

    const fetchUserData = async (url, header, setter) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter({
        user_id: loggedInfo[0].user_id,
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
      setIsLoading(false);
    };
    const fetchData = async (url, header, setter) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
      setIsLoading(false);
    };
    // inicio de funciones de consultas
    fetchUserData(getUserData, header, setUser);
    fetchData(getPaisData, header, setPaises);
  }, [history, setUser]);

  return (
    <MainLayout Tittle="Perfil de usuario">
      {isLoading && <BackdropSpinner isLoading={!isLoading} />}
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <Profile userDetails={user} />
          </Grid>

          <Grid item lg={8} md={6} xs={12}>
            <ProfileDetails
              userDetails={user}
              paises={paises}
              handleChange={handleChange}
              handleOnSubmit={handleOnSubmit}
              isLoading={isLoading}
            />
            <Box mt={3}>
              <Password
                passwords={passwords}
                handleChangePassword={handleChangePassword}
                handleOnSubmitPassword={handleOnSubmitPassword}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default ProfilePage;
