import React from "react";
import { CircularProgress, makeStyles, Backdrop } from "@material-ui/core";
import * as styles from "../../helpers/styles";

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));

const BackdropSpinner = ({ isLoading }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={!isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropSpinner;
