import React, { useState, useEffect, useContext, memo } from "react";
import { Container, Grid, Box } from "@material-ui/core";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import * as toast from "../../helpers/toast";
import BackButton from "../../components/BackButton/BackButton";
import RegisterForm from "./RegisterForm";
import BackdropSpinner from "../../components/BackDrop/backDrop";

const UserCreate = () => {
  // state
  const [isLoading, setIsLoading] = useState(false);
  const [paises, setPaises] = useState([]);
  const [user] = useContext(UserContext);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "*12345",
    repeat_password: "*12345",
    name: "",
    lastname: "",
    address: "",
    rol: "Usuario Final",
    contact_number: "",
    correo_electronico: "",
    id_pais: 1,
  });

  //funciones
  const getPaisData = url.getPaisesUrl();
  const history = useHistory();

  const handleChange = (event) => {
    setNewUser({
      ...newUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (!newUser.name) return toast.errorToast("Nombre no puede ir vacio!");
    if (!newUser.lastname)
      return toast.errorToast("Apellido no puede ir vacio!");
    if (!newUser.correo_electronico)
      return toast.errorToast("Correo electrónico no puede ir vacio!");
    if (!newUser.id_pais) return toast.errorToast("Pais no puede ir vacio!");
    if (!newUser.address)
      return toast.errorToast("Dirección no puede ir vacia!");

    const body = JSON.stringify({
      name: newUser.name,
      lastname: newUser.lastname,
      correo_electronico: newUser.correo_electronico,
      contact_number: newUser.contact_number,
      id_pais: newUser.id_pais,
      address: newUser.address,
      rol: newUser.rol,
      password: newUser.password,
      repeat_password: newUser.repeat_password,
      username: newUser.username,
    });

    const header = fetch.requestHeader("POST", body, localStorage.token);
    const registerServiceUrl = url.registerUrl();

    setIsLoading(true);

    const loggedInfo = await fetch.fetchData(registerServiceUrl, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "Usuario creado exitosamente.") {
      setNewUser({
        username: "",
        password: "*12345",
        repeat_password: "*12345",
        name: "",
        lastname: "",
        address: "",
        rol: "Usuario Final",
        contact_number: "",
        correo_electronico: "",
        id_pais: 1,
      });
      toast.msgSuccess("Usuario creado exitosamente.");
    } else {
      toast.errorToast(loggedInfo);
    }
    setIsLoading(false);
  };

  //efectos

  useEffect(() => {
    fetch.UserRedirect(user, history);
    const headerGetData = fetch.requestHeader("GET", null, localStorage.token);
    const fetchDataPaises = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
    };
    setIsLoading(true);
    fetchDataPaises(getPaisData, headerGetData, setPaises);
    setIsLoading(false);
  }, [user, history, getPaisData]);

  return (
    <MainLayout Tittle="Nuevo Usuario">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Box display="flex" justifyContent="flex-end" p={2}>
            <BackButton texto="Atras" ruta="/users" />
          </Box>
          <Grid item lg={12} md={12} xs={12}>
            {paises.length > 0 ? (
              <RegisterForm
                isLoading={isLoading}
                paises={paises}
                userDetails={newUser}
                handleChange={handleChange}
                handleOnSubmit={handleOnSubmit}
              />
            ) : (
              <BackdropSpinner isLoading={isLoading} />
            )}
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default memo(UserCreate);
