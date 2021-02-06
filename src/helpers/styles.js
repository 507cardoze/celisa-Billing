import React from "react";
import Typography from "@material-ui/core/Typography";

export const loginStyles = (theme, fondo) => {
  return {
    root: {
      minHeight: "100vh",
    },
    image: {
      backgroundImage: `url(${fondo})`,
      backgroundRepeat: "no-repeat",
      backgroundColor:
        theme.palette.type === "light"
          ? theme.palette.grey[50]
          : theme.palette.grey[900],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    paper: {
      margin: theme.spacing(15, 4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(4),
    },
    submit: {
      backgroundColor: theme.palette.secondary.main,
      margin: theme.spacing(3, 0, 2),
      fontWeight: "bold",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  };
};

export const mainLayOutStyles = (theme) => {
  const drawerWidth = 240;
  return {
    root: {
      display: "flex",
    },
    toolbar: {
      paddingRight: 24,
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: "none",
    },
    title: {
      flexGrow: 1,
      fontWeight: "bold",
      textAlign: "center",
    },
    drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
    },
    container: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      maxWidth: "95%",
    },
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    fixedHeight: {
      height: 240,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    submit: {
      backgroundColor: theme.palette.secondary.main,
      margin: theme.spacing(3, 0, 2),
      fontWeight: "bold",
    },
    excel: {
      backgroundColor: "white",
      border: 0,
      color: "black",
      marginRight: 10,
    },
    mobileDrawer: {
      width: 256,
    },
    desktopDrawer: {
      width: 256,
      top: 64,
      height: "calc(100% - 64px)",
    },
    avatar: {
      cursor: "pointer",
      width: 64,
      height: 64,
    },
  };
};

export const passwordStyles = (theme) => {
  return {
    submit: {
      backgroundColor: theme.palette.secondary.main,
      margin: theme.spacing(3, 0, 2),
      fontWeight: "bold",
    },
  };
};

export const Copyright = ({ name }) => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {`Copyright ${name} © `}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
