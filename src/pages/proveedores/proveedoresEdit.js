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

function EditProveedor({ className, match, ...rest }) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useContext(UserContext);
  const [provData, setProvData] = useState(null);
  const proveedor_id = match.params.proveedor_id;

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

    const header = fetch.requestHeader("PUT", body, localStorage.token);
    const getProveedorDetails = url.getProveedorDetails();

    setIsLoading(true);
    fetch.UserRedirect(user, history);
    const loggedInfo = await fetch.fetchData(getProveedorDetails, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "Detalles Actualizados.") {
      history.push("/proveedores");
      toast.msgSuccess(loggedInfo);
    } else {
      toast.errorToast("error al crear proveedor");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetch.UserRedirect(user, history);
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const getProveedorDetails = url.getProveedorDetails();
    const fetchUserData = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter({
        proveedor_id: loggedInfo[0].proveedor_id,
        proveedor: loggedInfo[0].proveedor,
      });
    };
    fetchUserData(
      `${getProveedorDetails}?proveedor_id=${proveedor_id}`,
      header,
      setProvData,
    );
  }, [user, history, proveedor_id]);
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
            subheader="Actualize la información del proveedor"
            title="Editar Proveedor"
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
                    value={provData.proveedor}
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

export default memo(EditProveedor);
