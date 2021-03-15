import React, { useState, useEffect, useContext, memo } from "react";
import { Container, Grid, Box, Tabs, Tab } from "@material-ui/core";
import * as toast from "../../helpers/toast";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import { useHistory, Route } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import BackButton from "../../components/BackButton/BackButton";

function EditPedido({ match }) {
  const id_pedido = match.params.id_pedido;
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useContext(UserContext);

  return (
    <MainLayout Tittle={`Pedido ${id_pedido}`}>
      <Container
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        <Grid>
          <BackButton
            texto="Atras"
            style={{ marginRight: "1rem" }}
            ruta={"/pedidos"}
          />
        </Grid>
        <Grid container spacing={2}>
          <Grid
            xs={12}
            item
            style={{ backgroundColor: "black", height: "200px" }}
          ></Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default memo(EditPedido);
