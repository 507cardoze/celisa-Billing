import React, { useEffect, memo, Suspense } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "./theme/";
import { useJwt } from "react-jwt";
import * as url from "./helpers/urls";
import * as fetch from "./helpers/fetch";

// paginas
import { PrivateRoute } from "./components/PrivateRoute";
import MisOrdenes from "./pages/misOrdenes/";
import EditOrder from "./pages/ordenes/editOrders";
import Clientes from "./pages/clientes/";

// contexto

import { UserProvider } from "./Context/userContext";
import { OrderProvider } from "./Context/OrderContext";

function App() {
  const Login = React.lazy(() => import("./pages/login/"));
  const Dashboard = React.lazy(() => import("./pages/dashboard/"));
  const ProfilePage = React.lazy(() => import("./pages/profile/"));
  const NotFoundView = React.lazy(() => import("./pages/noView/"));
  const Users = React.lazy(() => import("./pages/users/"));
  const UsersEdit = React.lazy(() => import("./pages/users/userEdit"));
  const UsersCreate = React.lazy(() => import("./pages/users/userCreate"));
  const Pedidos = React.lazy(() => import("./pages/pedidos"));
  const Ordenes = React.lazy(() => import("./pages/ordenes"));
  const NewOrders = React.lazy(() => import("./pages/ordenes/newOrders"));
  const history = useHistory();
  const { isExpired } = useJwt(localStorage.accessToken);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (localStorage.token && localStorage.refresh_token) {
        if (!isExpired) return;
        const body = JSON.stringify({
          token: localStorage.refresh_token,
        });
        const TokenRenewServiceUrl = url.refreshTokenUrl();
        const headerRT = fetch.requestHeader("POST", body, "");

        try {
          const loggedInfo = await fetch.fetchData(
            TokenRenewServiceUrl,
            headerRT,
          );
          if (loggedInfo.accessToken) {
            localStorage.setItem("token", loggedInfo.accessToken);
            const getUserData = url.getUserUrl();
            const headerGetData = fetch.requestHeader(
              "GET",
              null,
              loggedInfo.accessToken,
            );
            const userdata = await fetch.fetchData(getUserData, headerGetData);
            if (userdata) {
              localStorage.removeItem("user");
              localStorage.setItem(
                "user",
                JSON.stringify({
                  user_id: userdata[0].user_id,
                  name: userdata[0].name,
                  lastname: userdata[0].lastname,
                  email: userdata[0].correo_electronico,
                  number: userdata[0].contact_number,
                  id_pais: userdata[0].id_pais,
                  address: userdata[0].address,
                  pais: userdata[0].pais,
                  estado: userdata[0].estado,
                  rol: userdata[0].rol,
                  username: userdata[0].username,
                }),
              );
            } else {
              return history.push("/login");
            }
          } else {
            return history.push("/login");
          }
        } catch (error) {
          return history.push("/login");
        }
      }
    }, 900000);
    return () => {
      clearInterval(interval);
    };
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <OrderProvider>
            <CssBaseline />
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute path="/profile" component={ProfilePage} />
              <PrivateRoute path="/users" component={Users} />
              <PrivateRoute path="/pedidos" component={Pedidos} />
              <PrivateRoute path="/orders" component={Ordenes} />
              <PrivateRoute path="/edit-orders/:id" component={EditOrder} />
              <PrivateRoute path="/create-orders" component={NewOrders} />
              <PrivateRoute path="/my-orders" component={MisOrdenes} />
              <PrivateRoute path="/create-user" component={UsersCreate} />
              <PrivateRoute path="/edit-user/:id" component={UsersEdit} />
              <PrivateRoute path="/clientes" component={Clientes} />
              <Route path="/login" component={Login} />
              <Route path="*" component={NotFoundView} />
            </Switch>
          </OrderProvider>
        </UserProvider>
      </ThemeProvider>
    </Suspense>
  );
}

export default memo(App);
