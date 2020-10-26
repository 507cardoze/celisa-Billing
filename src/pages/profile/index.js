import React, {useState,useEffect} from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import {Container,Grid, Box} from '@material-ui/core';
import Profile from './profile'
import ProfileDetails from './profileDetails'
import Password from './password'
import CircularProgress from '@material-ui/core/CircularProgress';
import * as toast from '../../helpers/toast'
import * as url from '../../helpers/urls';
import * as fetch from '../../helpers/fetch'
import { useHistory  } from "react-router-dom";
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from "@material-ui/core/styles";
import * as styles from '../../helpers/styles'

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));


function ProfilePage(){
  // state inicializado
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
    const [paises, setPaises] = useState([]);
    const [passwords, setPasswords] = useState({
      password: "",
      confirm_password: ""
    });
    const [userDetails, setUserDetails] = useState({
      user_id: 0,
      name: "",
      lastname: "",
      email: "",
      number: "",
      id_pais: 0,
      address: "",
      pais: "",
      estado: 0
    })

    const history = useHistory();
    // inicializar urls del api
    const getUserData = url.getUserUrl();
    const getPaisData = url.getPaisesUrl()
    // creando header para el fetch
    const headerGetData = fetch.requestHeader("GET",null, localStorage.token)

    const fetchUserData = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header)
      fetch.UnauthorizedRedirect(loggedInfo, history)
      setter({
        user_id:loggedInfo[0].user_id, 
        name: loggedInfo[0].name, 
        lastname: loggedInfo[0].lastname,
        email: loggedInfo[0].correo_electronico,
        number: loggedInfo[0].contact_number,
        id_pais: loggedInfo[0].id_pais,
        address: loggedInfo[0].address,
        pais: loggedInfo[0].pais,
        estado: loggedInfo[0].estado
      });
    }
    const fetchData = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header)
      fetch.UnauthorizedRedirect(loggedInfo, history)
      setter(loggedInfo);
    }

  

const handleChange = (event) => {
  setUserDetails({
    ...userDetails,
    [event.target.name]: event.target.value
  });
};

const handleChangePassword = (event) => {
  setPasswords({
    ...passwords,
    [event.target.name]: event.target.value
  });
};

const handleOnSubmit = async (event) => {
  event.preventDefault();

if(!userDetails.name) return toast.errorToast("Nombre no puede ir vacio!")
if(!userDetails.lastname) return toast.errorToast("Apellido no puede ir vacio!")
if(!userDetails.email) return toast.errorToast("Correo electrónico no puede ir vacio!")
if(!userDetails.id_pais) return toast.errorToast("Pais no puede ir vacio!")
if(!userDetails.address) return toast.errorToast("Dirección no puede ir vacia!")


const body = JSON.stringify({
  name: userDetails.name,
  lastname: userDetails.lastname,
  email: userDetails.email,
  number: userDetails.number,
  id_pais: userDetails.id_pais,
  address: userDetails.address,
  user_id: userDetails.user_id
})

const header = fetch.requestHeader("PUT", body , localStorage.token)
const updateServiceUrl = url.updateUserDetailsUrl()

    setIsLoading(true)

    const loggedInfo = await fetch.fetchData(updateServiceUrl, header)
    fetch.UnauthorizedRedirect(loggedInfo, history)
    if (loggedInfo === "Detalles Actualizados.") {
      fetchUserData(getUserData, headerGetData, setUserDetails)
      fetchData(getPaisData, headerGetData, setPaises)
    }else{
      toast.errorToast("error al actualizar los datos.")
    }

     setIsLoading(false)       

}

const handleOnSubmitPassword = async (event) => {
  event.preventDefault();

if(!passwords.password) return toast.errorToast("contraseña no puede ir vacia!")
if(passwords.password !== passwords.confirm_password) return toast.errorToast("Contraseña no coinciden!")


const body = JSON.stringify({
  user_id: userDetails.user_id,
  password: passwords.password
})

const header = fetch.requestHeader("POST", body , localStorage.token)
const resetServiceUrl = url.resetPasswordUrl()

    setIsLoading(true)

    const loggedInfo = await fetch.fetchData(resetServiceUrl, header)
    fetch.UnauthorizedRedirect(loggedInfo, history)
    if (loggedInfo === "Contraseña cambiada con exito.") {
      setPasswords({
        password: "",
        confirm_password: ""
      })
      toast.msgSuccess(loggedInfo);
    }else{
      toast.errorToast("error al cambiar la contraseña.")
    }

     setIsLoading(false)       

}



useEffect(()=>{
  const getUserData = url.getUserUrl();
  const getPaisData = url.getPaisesUrl()
  const header = fetch.requestHeader("GET",null, localStorage.token)
  //consultas al api
  const fetchUserData = async (url, header, setter) => {
    const loggedInfo = await fetch.fetchData(url, header)
    fetch.UnauthorizedRedirect(loggedInfo, history)
    setter({
      user_id:loggedInfo[0].user_id, 
      name: loggedInfo[0].name, 
      lastname: loggedInfo[0].lastname,
      email: loggedInfo[0].correo_electronico,
      number: loggedInfo[0].contact_number,
      id_pais: loggedInfo[0].id_pais,
      address: loggedInfo[0].address,
      pais: loggedInfo[0].pais,
      estado: loggedInfo[0].estado
    });
  }
  const fetchData = async (url, header, setter) => {
    const loggedInfo = await fetch.fetchData(url, header)
    fetch.UnauthorizedRedirect(loggedInfo, history)
    setter(loggedInfo);
  }
  // inicio de funciones de consultas
  fetchUserData(getUserData, header, setUserDetails)
  fetchData(getPaisData, header, setPaises)
},[history])


    return <MainLayout Tittle="Perfil de usuario">
     {isLoading &&  <Backdrop className={classes.backdrop} open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>}
      <Container maxWidth="lg">
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          {userDetails.estado
          ? <Profile userDetails={userDetails}  /> 
          : <CircularProgress />
          }
          
        </Grid>
        
        <Grid
          item
          lg={8}
          md={6}
          xs={12}
        >
          {userDetails.estado
          ? <ProfileDetails userDetails={userDetails} paises={paises} handleChange={handleChange} handleOnSubmit={handleOnSubmit} isLoading={isLoading} />
          : <CircularProgress />}
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
} 

export default ProfilePage;