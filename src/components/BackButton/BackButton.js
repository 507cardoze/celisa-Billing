import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import * as styles from "../../helpers/styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));

const BackButton = ({ texto, ruta }) => {
  const history = useHistory();
  const classes = useStyles();
  const moveBack = () => history.push(ruta);
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

export const CustomButton = ({ text, onClick, style = null }) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      className={classes.submit}
      style={style}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default BackButton;
