import { useState, useEffect } from "react";
import PropTypes from "prop-types";

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
  } catch (error) {
    console.log("error: ", error);
    return "conexion error";
  }
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
