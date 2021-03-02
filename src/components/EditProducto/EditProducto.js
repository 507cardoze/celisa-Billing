import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Container,
  Grid,
  Button,
  InputAdornment,
} from "@material-ui/core";
import BackdropSpinner from "../BackDrop/backDrop";
import { useHistory } from "react-router-dom";
import * as fetch from "../../helpers/fetch";
import { UserContext } from "../../Context/userContext";
import * as url from "../../helpers/urls";
import * as toast from "../../helpers/toast";

function EditProducto(props) {
  const orden_id = props.match.params.id;
  const linea_id = props.match.params.linea_id;
  const margin = { margin: 5 };
  const history = useHistory();
  const [user] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [talla, setTalla] = useState("");
  const [color, setColor] = useState("");
  const [precio, setPrecio] = useState(0);

  const onSubmit = async (event) => {
    event.preventDefault();
    //validar

    //set up payload
    const body = JSON.stringify({
      linea_id,
      descripcion,
      talla,
      color,
      precio,
    });

    const header = fetch.requestHeader("PUT", body, localStorage.token);
    const fetchData = async (url, header) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      if (loggedInfo) {
        toast.msgSuccess(loggedInfo);
        props.refreshData();
        history.push(`/edit-orders/${orden_id}`);
      } else {
        toast.errorToast(loggedInfo);
      }
      setIsLoading(false);
    };

    fetchData(url.updateCamposProductosUrl(), header);
  };

  useEffect(() => {
    fetch.UserRedirect(user, history);
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const fetchData = async (url, header) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      if (loggedInfo) {
        setDescripcion(loggedInfo[0].descripcion);
        setTalla(loggedInfo[0].talla);
        setColor(loggedInfo[0].color);
        setPrecio(loggedInfo[0].precio);
      } else {
        history.push(`/edit-orders/${orden_id}`);
      }
      setIsLoading(false);
    };

    fetchData(`${url.getCamposProductosUrl()}?linea_id=${linea_id}`, header);

    return () => {
      setDescripcion("");
      setTalla("");
      setColor("");
      setPrecio(0);
    };
  }, [linea_id, history, user, orden_id]);

  return (
    <Container maxWidth={false}>
      <BackdropSpinner isLoading={!isLoading} />
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              window.confirm("No se han guardado los cambios, desea regresar?")
                ? history.push(`/edit-orders/${orden_id}`)
                : null
            }
          >
            Cancelar
          </Button>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item xs={12} sm={8} md={3}>
            <TextField
              variant="outlined"
              label="Descripción*"
              name="descripcion"
              value={descripcion ? descripcion : ""}
              size="small"
              style={margin}
              fullWidth
              onChange={(event) => setDescripcion(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              variant="outlined"
              name="talla"
              label="Talla*"
              value={talla ? talla : ""}
              size="small"
              style={margin}
              fullWidth
              onChange={(event) => setTalla(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              variant="outlined"
              name="color"
              label="Color*"
              value={color ? color : ""}
              size="small"
              style={margin}
              fullWidth
              onChange={(event) => setColor(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              variant="outlined"
              name="precio"
              label="Precio*"
              type="number"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              value={precio ? precio : ""}
              style={margin}
              fullWidth
              onChange={(event) => setPrecio(parseFloat(event.target.value))}
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={
              descripcion.trim().length > 0 &&
              talla.trim().length > 0 &&
              color.trim().length > 0 &&
              precio > 0
                ? false
                : true
            }
          >
            Guardar Cambios
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default EditProducto;
