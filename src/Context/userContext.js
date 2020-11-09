import React, { useState, createContext, useEffect } from "react";
import * as url from "../helpers/urls";
import * as fetch from "../helpers/fetch";
import { useHistory } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const history = useHistory();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = url.getUserUrl();
    const headerGetData = fetch.requestHeader("GET", null, localStorage.token);
    const fetchUserData = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter({
        rol: loggedInfo[0].rol,
        user_id: loggedInfo[0].user_id,
        name: loggedInfo[0].name,
        lastname: loggedInfo[0].lastname,
        email: loggedInfo[0].correo_electronico,
        number: loggedInfo[0].contact_number,
        id_pais: loggedInfo[0].id_pais,
        address: loggedInfo[0].address,
        pais: loggedInfo[0].pais,
        estado: loggedInfo[0].estado,
      });
    };
    fetchUserData(getUserData, headerGetData, setUser);

    return () => {
      setUser({});
    };
  }, [history]);
  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  );
};
