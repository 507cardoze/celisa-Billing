import React from 'react';
import { Switch, Route} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from '@material-ui/core';
import theme from './theme/index';
import {PrivateRoute} from './components/PrivateRoute'
import Login from './pages/login/'
import Dashboard from './pages/dashboard/'
import ProfilePage from './pages/profile/'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Switch>
      <PrivateRoute exact path="/" component={Dashboard} />
      <PrivateRoute path="/profile" component={ProfilePage} />
      <Route path="/login" component={Login} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
