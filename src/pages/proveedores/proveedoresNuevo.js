import React, { useState, useEffect, useContext, memo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import * as toast from "../../helpers/toast";
import BackdropSpinner from "../../components/BackDrop/backDrop";

function CrearProveedores({ className, ...rest }) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useContext(UserContext);
  const [provData, setProvData] = useState({
    proveedor: "",
  });

  const handleChange = (event) => {
    setProvData({
      ...provData,
      [event.target.name]: event.target.value,
    });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (!provData.proveedor.trim().length > 0)
      return toast.errorToast("El proveedor no puede ir vacio!");

    const body = JSON.stringify(provData);

    const header = fetch.requestHeader("POST", body, localStorage.token);
    const getProveedorDetails = url.getProveedorDetails();

    setIsLoading(true);
    fetch.UserRedirect(user, history);
    const loggedInfo = await fetch.fetchData(getProveedorDetails, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "Proveedor Creado.") {
      history.push("/proveedores");
      toast.msgSuccess(loggedInfo);
    } else {
      toast.errorToast("error al crear proveedor");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetch.UserRedirect(user, history);
  }, [user, history]);

  return (
    <>
      <BackdropSpinner isLoading={!isLoading} />
      <Button
        variant="contained"
        color="primary"
        style={{ margin: "10px" }}
        onClick={() => {
          history.push(`/proveedores`);
        }}
      >
        Atras
      </Button>
      <form autoComplete="off" noValidate {...rest} onSubmit={handleOnSubmit}>
        <Card raised>
          <CardHeader
            subheader="Ingrese la información del proveedor"
            title="Crear Proveedor"
          />
          <Divider />
          {provData && (
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    style={{ width: "20rem" }}
                    helperText="Por favor especifique el nombre del proveedor"
                    label="Nombre del proveedor"
                    name="proveedor"
                    onChange={handleChange}
                    required
                    value={provData.nombre}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          )}
          <Divider />
          <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
            alignItems="center"
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: "5px" }}
            >
              Guardar Detalles
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
}

export default memo(CrearProveedores);
