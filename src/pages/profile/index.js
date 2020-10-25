import React, {useState,useEffect} from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import {Container,Grid} from '@material-ui/core';
import Profile from './profile'
import ProfileDetails from './profileDetails'
import CircularProgress from '@material-ui/core/CircularProgress';

import * as url from '../../helpers/urls';
import * as fetch from '../../helpers/fetch'
import { useHistory  } from "react-router-dom";


function ProfilePage(){
    const [userData, setUserData] = useState([]);
    const [paises, setPaises] = useState([]);
    const history = useHistory();

    const [userDetails, setUserDetails] = useState({
      name: "",
      lastname: "",
      email: "",
      number: "",
      id_pais: 0,
      address: "",
      pais: "",
      estado: 0
    })


    

useEffect(()=>{
    const getUserData = url.getUserUrl();
    const header = fetch.requestHeader("GET",null, localStorage.token)
    const fetchUserData = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header)
      fetch.UnauthorizedRedirect(loggedInfo, history)
      setter({...userDetails, 
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
    fetchUserData(getUserData, header, setUserDetails)
},[history])

console.log("userDetails: ",userDetails)


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
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {userDetails.estado
          ? <Profile userDetails={userDetails} /> 
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
          ? <ProfileDetails userDetails={userDetails} />
          : <CircularProgress />}
        </Grid>
        
      </Grid>
    </Container>
        
    </MainLayout>
} 

export default ProfilePage;