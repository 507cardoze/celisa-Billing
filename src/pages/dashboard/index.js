import React from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import "moment/locale/es.js";

function Dashboard() {

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
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <MainLayout Tittle="Consola de datos">
      <Grid container spacing={2}>
          <Grid item xs={12} md={5} lg={5}>
          <Paper className={fixedHeightPaper}>
                
              </Paper>
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
          <Paper className={fixedHeightPaper}>
              </Paper>
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
          <Paper className={fixedHeightPaper}>
                
              </Paper>
          </Grid>

          <Grid item xs={12} md={5} lg={5}>
          <Paper className={fixedHeightPaper}>
               
              </Paper>
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
          <Paper className={fixedHeightPaper}>
               
              </Paper>
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
          <Paper className={fixedHeightPaper}>
                
              </Paper>
          </Grid>
        </Grid>
    </MainLayout>
  );
}

export default Dashboard;
