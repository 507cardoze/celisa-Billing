import React, { useState, useEffect, useContext } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import { Container, Grid, Box } from "@material-ui/core";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import * as toast from "../../helpers/toast";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import BackButton from "../../components/BackButton/BackButton";
import NumericToolBar from "../../components/NumericToolBar/NumericToolBar";
import OrderDetails from "../../components/OrderDetail/OrderDetail";

function EditOrder({ match }) {
  const id_orden = parseInt(match.params.id);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useContext(UserContext);
  const [orden, setOrden] = useState({});

  const urlGet = url.getByIdOrdenUrl();

  useEffect(() => {
    fetch.UserRedirect(user, history);
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const fetchData = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
    };
    setIsLoading(true);
    fetchData(`${urlGet}/${id_orden}`, header, setOrden);
    setIsLoading(false);
  }, [user, history, urlGet]);

  console.log(orden);

  return (
    <MainLayout Tittle={`Editar orden #${id_orden}`}>
      {isLoading && <BackdropSpinner isLoading={!isLoading} />}
      <Container maxWidth={false}>
        <BackButton texto="Atras" ruta="/orders" />
        <Grid container spacing={1} component="div">
          <Grid item xs={6}>
            <OrderDetails orden={orden} />
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default EditOrder;
