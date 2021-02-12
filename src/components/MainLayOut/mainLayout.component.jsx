import React, { useState, memo } from "react";
import clsx from "clsx";
import {
  makeStyles,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import MainList from "../MainList/mainList.component";
import * as fetch from "../../helpers/fetch";
import * as url from "../../helpers/urls";
import * as styles from "../../helpers/styles";
import { useStickyState } from "../../helpers/fetch";
import { Helmet } from "react-helmet";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/ChevronLeft";
import BackdropSpinner from "../../components/BackDrop/backDrop";

function MainLayout(props) {
  const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));
  const classes = useStyles();
  const [open, setOpen] = useStickyState(false, "open");
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleLogout = async () => {
    setIsLoading(true);
    const logout = url.logoutUrl();
    const header = fetch.requestHeader("DELETE", "", localStorage.token);

    try {
      const query = await fetch(logout, header);
      await query.json();
      localStorage.clear();
      history.push("/login");
    } catch (error) {
      localStorage.clear();
      history.push("/login");
    }

    setIsLoading(false);
  };

  return (
    <div className={classes.root}>
      <BackdropSpinner isLoading={!isLoading} />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Helmet title={props.Tittle.toUpperCase()} />
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden,
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {props.Tittle.toUpperCase()}
          </Typography>

          <IconButton color="inherit" onClick={handleLogout}>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              style={{ marginRight: 15 }}
            >
              {`Cerrar sesion`}
            </Typography>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <MainList />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="false" className={classes.container}>
          {props.children}
        </Container>
      </main>
    </div>
  );
}

export default memo(MainLayout);
