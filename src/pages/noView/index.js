import React from "react";
import { Box, Container, Typography, makeStyles } from "@material-ui/core";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import noViewSVG from "../../static/undraw_page_not_found_su7k.svg";

const NotFoundView = () => {
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      height: "100%",
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3),
    },
    image: {
      marginTop: 50,
      display: "inline-block",
      maxWidth: "100%",
      width: 560,
    },
  }));
  const classes = useStyles();

  return (
    <MainLayout className={classes.root} Tittle="página no existe">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Typography align="center" color="textPrimary" variant="h1">
            404: La página que estás buscando no está aquí
          </Typography>
          <Typography align="center" color="textPrimary" variant="subtitle2">
            O intentaste alguna ruta sombreada o viniste aquí por error. Sea lo
            que sea, intente usar la navegación a la izquierda.
          </Typography>
          <Box textAlign="center">
            <img
              alt="Under development"
              className={classes.image}
              src={noViewSVG}
            />
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default NotFoundView;
