import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import * as styles from "../../helpers/styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));

const BackButton = ({ texto, ruta, ...otherProps }) => {
  const history = useHistory();
  const classes = useStyles();
  const moveBack = () => history.push(ruta);
  return (
    <Button
      variant="contained"
      className={classes.submit}
      onClick={moveBack}
      {...otherProps}
    >
      {texto}
    </Button>
  );
};

export const CustomButton = ({
  text,
  onClick,
  style = null,
  disabled = false,
  ...otherProps
}) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      className={classes.submit}
      style={style}
      onClick={onClick}
      disabled={disabled}
      {...otherProps}
    >
      {text}
    </Button>
  );
};

export default BackButton;
