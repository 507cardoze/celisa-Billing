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

export const activosPedidosUrl = () => {
	return `${process.env.REACT_APP_BACK_END}/v1/pedidos/activos`;
};

//PEDIDOS

//ORDENES

export const getOrdenesUrl = () => {
	return `${process.env.REACT_APP_BACK_END}/v1/ordenes/all-ordenes`;
};

export const getMyOrdenesUrl = () => {
	return `${process.env.REACT_APP_BACK_END}/v1/ordenes/my-ordenes`;
};

export const searchOrdenesUrl = () => {
	return `${process.env.REACT_APP_BACK_END}/v1/ordenes/search`;
};

export const crearOrdenesUrl = () => {
	return `${process.env.REACT_APP_BACK_END}/v1/ordenes/crear`;
};

export const getByIdOrdenUrl = () => {
	return `${process.env.REACT_APP_BACK_END}/v1/ordenes/get-orden-details`;
};

export const updateOrdenDetailsUrl = () => {
	return `${process.env.REACT_APP_BACK_END}/v1/ordenes/update-order-details`;
};

export const addProductoOrdenUrl = () => {
	return `${process.env.REACT_APP_BACK_END}/v1/ordenes/add-product-orden`;
};

export const deleteProductoUrl = () => {
	return `${process.env.REACT_APP_BACK_END}/v1/ordenes/delete-producto`;
};

export const updateCantidadUrl = () => {
	return `${process.env.REACT_APP_BACK_END}/v1/ordenes/update-cantidad`;
};

//ORDENES
