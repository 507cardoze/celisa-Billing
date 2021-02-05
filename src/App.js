import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme/";
import { PrivateRoute } from "./components/PrivateRoute";
import Login from "./pages/login/";
import Dashboard from "./pages/dashboard/";
import ProfilePage from "./pages/profile/";
import NotFoundView from "./pages/noView/";
import Users from "./pages/users/";
import UsersEdit from "./pages/users/userEdit";
import UsersCreate from "./pages/users/userCreate";
import Pedidos from "./pages/pedidos";
import Ordenes from "./pages/ordenes";
import NewOrders from "./pages/ordenes/newOrders";
import MisOrdenes from "./pages/misOrdenes/";
import EditOrder from "./pages/ordenes/editOrders";
import { UserProvider } from "./Context/userContext";
import { OrderProvider } from "./Context/OrderContext";
import { useJwt } from "react-jwt";
import * as url from "./helpers/urls";
import * as fetch from "./helpers/fetch";

function App() {
  const history = useHistory();
  const { isExpired } = useJwt(localStorage.accessToken);

  useEffect(() => {
    console.log("background job...");
    const interval = setInterval(async () => {
      console.log("running...");
      if (localStorage.token && localStorage.refresh_token) {
        console.log("both token exist...");
        if (!isExpired) return;

        console.log("token is not expired...");
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
          console.log(loggedInfo);
          if (loggedInfo.accessToken) {
            localStorage.setItem("token", loggedInfo.accessToken);
            const getUserData = url.getUserUrl();
            const headerGetData = fetch.requestHeader(
              "GET",
              null,
              loggedInfo.accessToken,
            );
            const userdata = await fetch.fetchData(getUserData, headerGetData);
            console.log(userdata);
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
    <UserProvider>
      <OrderProvider>
        <ThemeProvider theme={theme}>
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
            <Route path="/login" component={Login} />
            <Route path="*" component={NotFoundView} />
          </Switch>
        </ThemeProvider>
      </OrderProvider>
    </UserProvider>
  );
}

export default App;
