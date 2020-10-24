export const loginServiceUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/login`;
}

export const logoutUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/logout`;
}

export const resetPasswordUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/logout`;
}

export const refreshTokenUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/token`;
}

export const registerUrl = () => {
    return `${process.env.REACT_APP_BACK_END}/v1/auth/register`;
}