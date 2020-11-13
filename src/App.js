import React from "react";
import { Switch, Route } from "react-router-dom";
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

import { UserProvider } from "./Context/userContext";

function App() {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/profile" component={ProfilePage} />
          <PrivateRoute path="/users" component={Users} />
          <PrivateRoute path="/pedidos" component={Pedidos} />
          <PrivateRoute path="/orders" component={Ordenes} />
          <PrivateRoute path="/create-orders" component={NewOrders} />
          <PrivateRoute path="/create-user" component={UsersCreate} />
          <PrivateRoute path="/edit-user/:id" component={UsersEdit} />
          <Route path="/login" component={Login} />
          <Route path="*" component={NotFoundView} />
        </Switch>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
