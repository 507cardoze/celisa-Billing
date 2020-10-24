import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import * as url from './urls'
import { useHistory  } from "react-router-dom";

export const requestHeader = (method, body = {}, token) => {
    
    return {
        method,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": token ? `Bearer ${token}` : "" ,
        },
        mode: "cors",
        cache: "default",
        body: body,
    }
}

requestHeader.PropTypes = {
    method: PropTypes.string,
    token: PropTypes.string,
    body:  PropTypes.object
};




export const fetchData = async (url, header) => {
    try {
        const query = await fetch(url, header);
        const parsed = await query.json();
        return parsed;
    } catch (error) {
        return "conexion error";
    }
}



export const SubcriberRefreshToken = ({children}) => {
    const history = useHistory();
    useEffect(() => {
        
          const interval = setInterval(async() => {
          const body = JSON.stringify({token: localStorage.refresh_token})
          const TokenRenewServiceUrl = url.refreshTokenUrl()
          const header = requestHeader("POST", body , "" )
          const loggedInfo = await fetchData(TokenRenewServiceUrl, header)

          if (loggedInfo.accessToken) {
            localStorage.setItem("token", loggedInfo.accessToken);
          }else{
              localStorage.clear()
              history.push("/login");
          }

        }, 600000);
    
        return () => {
            clearInterval(interval)
        };
      })
    return (
        <>
        {children}
        </>
    );
  }


