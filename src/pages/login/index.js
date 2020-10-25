import React,{useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import fondoPrincipal from '../../static/fondo-principal.jpg'
import * as fetch from '../../helpers/fetch'
import * as styles from '../../helpers/styles'
import * as toast from '../../helpers/toast'
import * as url from '../../helpers/urls';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect,useHistory  } from "react-router-dom";

const useStyles = makeStyles((theme) => styles.loginStyles(theme, fondoPrincipal));

function Login() {
  const classes = useStyles();
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();


  const handleOnSubmit = async e => {
    e.preventDefault();

    if(username.length === 0) return toast.errorToast("Usuario no puede ir vacio!")
    if(password.length === 0) return toast.errorToast("Contraseña no puede ir vacio!")

    const body = JSON.stringify({
      username: username,
      password: password,
    })

    const loginService = url.loginServiceUrl();
    const header = fetch.requestHeader("POST", body , "" )

    setIsLoading(true)

    const loggedInfo = await fetch.fetchData(loginService, header)
    if (loggedInfo.accessToken) {
      localStorage.setItem("token", loggedInfo.accessToken);
      localStorage.setItem("refresh_token", loggedInfo.refreshToken);
      history.push("/");
    }else if(loggedInfo === "conexion error") {
      toast.msgWarn("Verifique su conexion a internet.")
    }else{
      toast.errorToast(loggedInfo)
    }

    setIsLoading(false)

  }
 

  return (
    <Grid container component="main" className={classes.root}>
      {localStorage.token && <Redirect to="/" />}
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Celisa Store Billing
          </Typography>
          <form className={classes.form} onSubmit={handleOnSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Usuario"
              value={username}
              onChange={e=>setUserName(e.target.value)}
              autoFocus
              disabled={isLoading}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              disabled={isLoading}
            />
            {isLoading ? (
              <Backdrop className={classes.backdrop} open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Entrar
              </Button>
            )}
            <Box mt={5}>
              <styles.Copyright name="Anthony Cardoze" />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default Login;
