//AUTH

export const loginServiceUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/auth/login`;
};

export const logoutUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/auth/logout`;
};

export const resetPasswordUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/auth/reset`;
};

export const refreshTokenUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/auth/token`;
};

export const registerUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/auth/register`;
};

export const getUserUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/auth/user-data`;
};

export const updateUserDetailsUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/auth/update-data`;
};

export const getPaisesUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/pais/all`;
};

export const getAllUsersUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/auth/all-users`;
};

export const getSearchUsersUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/auth/search`;
};

export const getUserByIdUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/auth/byUserId`;
};

export const getUserEstadoChangeUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/auth/estado-update`;
};

//AUTH

// PEDIDOS

export const getPedidosUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/pedidos/all-pedidos`;
};

export const searchPedidosUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/pedidos/search`;
};

export const crearPedidoUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/pedidos/crear`;
};

export const closeAllPedidoUrl = () => {
  return `${process.env.REACT_APP_BACK_END}/v1/pedidos/closeAll`;
};

//PEDIDOS
