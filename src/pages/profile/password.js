import React, { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import * as styles from "../../helpers/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => styles.passwordStyles(theme));

const Password = ({
  className,
  passwords,
  handleChangePassword,
  handleOnSubmitPassword,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      onSubmit={handleOnSubmitPassword}
      {...rest}
    >
      <Card>
        <CardHeader subheader="Actualiza contraseña" title="Contraseña" />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Nueva contraseña"
            margin="normal"
            name="password"
            onChange={handleChangePassword}
            type="password"
            value={passwords.password}
            variant="outlined"
            autoComplete="new-password"
          />
          <TextField
            fullWidth
            label="Confirma la contraseña"
            margin="normal"
            name="confirm_password"
            onChange={handleChangePassword}
            type="password"
            value={passwords.confirm_password}
            variant="outlined"
            autoComplete="new-password"
          />
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Actualizar
          </Button>
        </Box>
      </Card>
    </form>
  );
};

Password.propTypes = {
  className: PropTypes.string,
};

export default memo(Password);
