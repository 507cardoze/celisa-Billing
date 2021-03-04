import React, { useEffect, useContext, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import { Container } from "@material-ui/core";
import ClientTable from "./clientTable";
import { Route } from "react-router-dom";
import CrearCliente from "./clienteNuevo";
import EditCliente from "./clienteEdit";
import { UserContext } from "../../Context/userContext";

function Clientes({ match, history }) {
  const [user] = useContext(UserContext);

  useEffect(() => {
    if (user?.rol === "Usuario Final") return history.push("/create-orders");
  }, [user, history]);

  return (
    <MainLayout Tittle="Clientes">
      <Container>
        <Route
          exact
          path={`${match.path}`}
          render={(props) => <ClientTable {...props} />}
        />
        <Route
          exact
          path={`${match.path}/crear`}
          render={(props) => <CrearCliente {...props} />}
        />
        <Route
          path={`${match.path}/editar/:cliente_id`}
          render={(props) => <EditCliente {...props} />}
        />
      </Container>
    </MainLayout>
  );
}

export default memo(Clientes);
