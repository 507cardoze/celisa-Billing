import React, { useState, useEffect, useContext, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import "moment/locale/es.js";
import { UserContext } from "../../Context/userContext";
import { useHistory } from "react-router-dom";
import * as fetch from "../../helpers/fetch";
import BackdropSpinner from "../../components/BackDrop/backDrop";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "space-around",
    maxHeight: 250,
    width: "100%",
  },
  fixedHeight: {
    height: "100vw",
  },
}));

function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [user] = useContext(UserContext);

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  useEffect(() => {
    fetch.UserRedirect(user, history);

    setIsLoading(true);

    setIsLoading(false);
  }, [user, history]);

  return (
    <MainLayout Tittle="Dashboard">
      <BackdropSpinner isLoading={!isLoading} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={5} lg={5}>
          <Paper className={fixedHeightPaper}></Paper>
        </Grid>
        <Grid item xs={12} md={5} lg={5}>
          <Paper className={fixedHeightPaper}></Paper>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Paper className={fixedHeightPaper}></Paper>
        </Grid>

        <Grid item xs={12} md={5} lg={5}>
          <Paper className={fixedHeightPaper}></Paper>
        </Grid>
        <Grid item xs={12} md={5} lg={5}>
          <Paper className={fixedHeightPaper}></Paper>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Paper className={fixedHeightPaper}></Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}

export default memo(Dashboard);
