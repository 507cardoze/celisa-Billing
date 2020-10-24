import React, { useState} from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MainList from "../MainList/mainList.component";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import * as fetch from '../../helpers/fetch'
import * as url from '../../helpers/urls';
import { useHistory  } from "react-router-dom";
import * as styles from '../../helpers/styles'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));

function MainLayout(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleLogout = async () => {

    setIsLoading(true)

    const logout = url.logoutUrl();
    const header = fetch.requestHeader("DELETE", "" , localStorage.token)
    const loggedInfo = await fetch.fetchData(logout, header)

    if(loggedInfo === "refresh token deleted."){
      localStorage.clear()
      history.push("/login");
    }else{
      localStorage.clear()
      history.push("/login");
    }

  }

  return (
    <div className={classes.root}>
      { isLoading && <Backdrop className={classes.backdrop} open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>}
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
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
            {props.Tittle}
          </Typography>

          <IconButton color="inherit" onClick={handleLogout}>
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
          <MainList  />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {props.children}
        </Container>
      </main>
    </div>
  );
}

export default MainLayout;
