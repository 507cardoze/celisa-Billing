import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as url from "./urls";
import { useHistory } from "react-router-dom";

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
    if (parsed === "No esta autorizado") {
      const body = JSON.stringify({ token: localStorage.refresh_token });
      const TokenRenewServiceUrl = url.refreshTokenUrl();
      const headerRT = requestHeader("POST", body, "");
      const loggedInfo = await fetchData(TokenRenewServiceUrl, headerRT);

      if (loggedInfo.accessToken) {
        localStorage.removeItem("token");
        localStorage.setItem("token", loggedInfo.accessToken);

        header.headers.Authorization = `Bearer ${loggedInfo.accessToken}`;

        const requery = await fetch(urls, header);
        const reparsed = await requery.json();
        return reparsed;
      } else {
        return "No esta autorizado";
      }
    }
    return parsed;
  } catch (error) {
    return "conexion error";
  }
};

export const SubcriberRefreshToken = ({ children }) => {
  const history = useHistory();
  useEffect(() => {
    const interval = setInterval(async () => {
      if (localStorage.refresh_token === null || localStorage.token === null) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        history.push("/login");
      }
    }, 300000);

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
  if (data === "conexion error") {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    history.push("/login");
  }
};

export const UserRedirect = (user, history) => {
  if (user && user.rol !== "Administrador") return history.push("/profile");
};
