import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import * as styles from "../../helpers/styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));

const BackButton = ({ texto, ruta }) => {
  const history = useHistory();
  const classes = useStyles();
  const moveBack = () => {
    return history.push(ruta);
  };
  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.submit}
      onClick={moveBack}
    >
      {texto}
    </Button>
  );
};

export default BackButton;
