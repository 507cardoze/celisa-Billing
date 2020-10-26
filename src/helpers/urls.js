export const loginServiceUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/login`;
}

export const logoutUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/logout`;
}

export const resetPasswordUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/reset`;
}

export const refreshTokenUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/token`;
}

export const registerUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/register`;
}

export const getUserUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/user-data`;
}

export const updateUserDetailsUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/update-data`;
}

export const getPaisesUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/pais/all`;
}

