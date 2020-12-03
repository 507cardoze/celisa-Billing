import React, { useState, useEffect, useContext } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import * as toast from "../../helpers/toast";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import BackButton from "../../components/BackButton/BackButton";
import OrderDetails from "../../components/OrderDetail/OrderDetail";
import DashboardOrdenes from "../../components/DashboardOrdenes/DashboardOrdenes";
import moment from "moment";

function EditOrder({ match }) {
  const id_orden = parseInt(match.params.id);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useContext(UserContext);
  const [orden, setOrden] = useState(null);
  const [ordenIsEditable, setOrdenIsEditable] = useState(false);

  const urlGet = url.getByIdOrdenUrl();
  const header = fetch.requestHeader("GET", null, localStorage.token);
  const fetchData = async (url, header, setter) => {
    setIsLoading(true);
    const loggedInfo = await fetch.fetchData(url, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    setter(loggedInfo);
    setIsLoading(false);
  };

  useEffect(() => {
    fetch.UserRedirect(user, history);
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const fetchData = async (url, header, setter) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
      setIsLoading(false);
    };

    fetchData(`${urlGet}/${id_orden}`, header, setOrden);
  }, [user, history, urlGet]);

  const handleChange = (event) => {
    setOrden({
      ...orden,
      [event.target.name]: event.target.value,
    });
  };

  const toggleEditableDetails = () => {
    return setOrdenIsEditable(!ordenIsEditable);
  };

  const refreshData = () => {
    return fetchData(`${urlGet}/${id_orden}`, header, setOrden);
  };

  const suma = (acc, cur) => {
    return acc + Number(cur.cantidad) * Number(cur.precio);
  };

  const sumaPagos = (acc, cur) => {
    return acc + Number(cur.cantidad);
  };

  console.log(orden);

  return (
    <MainLayout Tittle={`Editar orden #${id_orden}`}>
      {isLoading ? (
        <BackdropSpinner isLoading={!isLoading} />
      ) : (
        <Container maxWidth="lg">
          <BackButton texto="Atras" ruta="/orders" />
          <Grid container spacing={1}>
            {orden ? (
              <>
                <OrderDetails
                  orden={orden}
                  handleChange={handleChange}
                  ordenIsEditable={ordenIsEditable}
                  toggleEditableDetails={toggleEditableDetails}
                  refreshData={refreshData}
                />
                <DashboardOrdenes
                  orden={orden}
                  suma={suma}
                  sumaPagos={sumaPagos}
                />
              </>
            ) : (
              "cargando..."
            )}

            <Grid item xs={12} md={6} lg={6}>
              productos productos productos
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              cobros cobros cobros
            </Grid>
          </Grid>
        </Container>
      )}
    </MainLayout>
  );
}

export default EditOrder;
