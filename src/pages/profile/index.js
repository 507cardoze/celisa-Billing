import React, {useState,useEffect} from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import {Container,Grid} from '@material-ui/core';
import Profile from './profile'
import ProfileDetails from './profileDetails'
import CircularProgress from '@material-ui/core/CircularProgress';
import * as toast from '../../helpers/toast'
import * as url from '../../helpers/urls';
import * as fetch from '../../helpers/fetch'
import { useHistory  } from "react-router-dom";


function ProfilePage(){
  // state inicializado
  const [isLoading, setIsLoading] = useState(false);
    const [paises, setPaises] = useState([]);
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
    const header = fetch.requestHeader("GET",null, localStorage.token)

  useEffect(()=>{
    const getUserData = url.getUserUrl();
    const getPaisData = url.getPaisesUrl()
    const header = fetch.requestHeader("GET",null, localStorage.token)
    //consultas al api
    const fetchUserData = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header)
      fetch.UnauthorizedRedirect(loggedInfo, history)
      setter({...userDetails,
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

const handleChange = (event) => {
  setUserDetails({
    ...userDetails,
    [event.target.name]: event.target.value
  });
};

const handleOnSubmit = async (event) => {
  event.preventDefault();
  console.log("userDetails: ",userDetails)

if(!userDetails.name) return toast.errorToast("Nombre no puede ir vacio!")
if(!userDetails.lastname) return toast.errorToast("Apellido no puede ir vacio!")
if(!userDetails.email) return toast.errorToast("Correo electrónico no puede ir vacio!")
if(!userDetails.id_pais) return toast.errorToast("Pais no puede ir vacio!")
if(!userDetails.address) return toast.errorToast("Dirección no puede ir vacia!")


// const body = JSON.stringify({
//   name: userDetails.name,
//   lastname: userDetails.lastname,
//   email: userDetails.email,
//   number: userDetails.number,
//   id_pais: userDetails.id_pais,
//   address: userDetails.address,
//   user_id: userDetails.user_id
// })

// const header = fetch.requestHeader("PUT", body , localStorage.token)
// const updateServiceUrl = url.updateUserDetailsUrl()

//     setIsLoading(true)

//     const loggedInfo = await fetch.fetchData(updateServiceUrl, header)
//     if (loggedInfo === "Detalles Actualizados.") {
//       fetch.UnauthorizedRedirect(loggedInfo, history)
//     }else{

//     }

//      setIsLoading(false)       

}


console.log("paises: ",paises)


    return <MainLayout Tittle="Perfil de usuario">
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
          ? <ProfileDetails userDetails={userDetails} paises={paises} handleChange={handleChange} handleOnSubmit={handleOnSubmit} />
          : <CircularProgress />}
        </Grid>
        
      </Grid>
    </Container>
        
    </MainLayout>
} 

export default ProfilePage;