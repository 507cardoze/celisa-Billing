import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as url from "./urls";
import { useHistory } from "react-router-dom";
import { useJwt } from "react-jwt";

export const requestHeader = (method, body = {}, token) => {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: token ? `Bearer ${token}` : "",
    },
    mode: "cors",
    cache: "default",
    body: body,
  };
};

requestHeader.PropTypes = {
  method: PropTypes.string,
  token: PropTypes.string,
  body: PropTypes.object,
};

export const fetchData = async (urls, header) => {
  try {
    const query = await fetch(urls, header);
    const parsed = await query.json();
    return parsed;

    // if (parsed === 'No esta autorizado') {
    // 	const body = JSON.stringify({
    // 		token: localStorage.refresh_token ? localStorage.refresh_token : null,
    // 	});
    // 	const TokenRenewServiceUrl = url.refreshTokenUrl();
    // 	const headerRT = requestHeader('POST', body, '');
    // 	const loggedInfo = await fetchData(TokenRenewServiceUrl, headerRT);
    // 	if (loggedInfo.accessToken) {
    // 		localStorage.setItem('token', loggedInfo.accessToken);
    // 		header.headers.Authorization = `Bearer ${loggedInfo.accessToken}`;
    // 		const requery = await fetch(urls, header);
    // 		const reparsed = await requery.json();
    // 		console.log('reparsed:', parsed);
    // 		return reparsed;
    // 	} else {
    // 		console.log('No esta autorizado');
    // 		return 'No esta autorizado';
    // 	}
    // } else {
    // 	console.log('parsed:', parsed);
    // 	return parsed;
    // }
  } catch (error) {
    console.log("error: ", error);
    return "conexion error";
  }
};

export const SubcriberRefreshToken = ({ children }) => {
  const history = useHistory();
  const { isExpired } = useJwt(localStorage.accessToken);
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isExpired && localStorage.refresh_token) {
        const body = JSON.stringify({
          token: localStorage.refresh_token,
        });
        const TokenRenewServiceUrl = url.refreshTokenUrl();
        const headerRT = requestHeader("POST", body, "");
        const loggedInfo = await fetchData(TokenRenewServiceUrl, headerRT);
        if (loggedInfo.accessToken) {
          localStorage.setItem("token", loggedInfo.accessToken);
        } else {
          return history.push("/login");
        }
      }
    }, 180000);

    return () => {
      clearInterval(interval);
    };
  });
  return <>{children}</>;
};

export function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const stickyValue = localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export const UnauthorizedRedirect = (data, history) => {
  if (data === "conexion error" || data === "No esta autorizado") {
    localStorage.clear();
    history.push("/login");
  }
};

export const UserRedirect = (user, history) => {
  if (user && user.rol !== "Administrador")
    return history.push("/create-orders");
};

export const numberWithCommas = (x) => {
  // return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  return x;
};
