import React, { useEffect, useContext, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import { Container } from "@material-ui/core";
import ProveedoresTable from "./proveedoresTable";
import { Route } from "react-router-dom";
import CrearProveedores from "./proveedoresNuevo";
import EditProveedor from "./proveedoresEdit";
import { UserContext } from "../../Context/userContext";

function Proveedores({ match, history }) {
  const [user] = useContext(UserContext);

  useEffect(() => {
    if (user?.rol === "Usuario Final") return history.push("/create-orders");
  }, [user, history]);

  return (
    <MainLayout Tittle="Proveedores">
      <Container>
        <Route
          exact
          path={`${match.path}`}
          render={(props) => <ProveedoresTable {...props} />}
        />
        <Route
          exact
          path={`${match.path}/crear`}
          render={(props) => <CrearProveedores {...props} />}
        />
        <Route
          path={`${match.path}/editar/:proveedor_id`}
          render={(props) => <EditProveedor {...props} />}
        />
      </Container>
    </MainLayout>
  );
}

export default memo(Proveedores);
