import React, { memo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import * as styles from "../../helpers/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));

const RegisterForm = ({
  className,
  userDetails,
  paises,
  handleChange,
  handleOnSubmit,
  isLoading,
  permiso = false,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
      onSubmit={handleOnSubmit}
    >
      <Card>
        <CardHeader
          subheader="Introduzca la información del nuevo usuario"
          title="Nuevo usuario"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Por favor especifique el nombre"
                label="Nombre"
                name="name"
                onChange={handleChange}
                required
                value={userDetails.name}
                variant="outlined"
                disabled={isLoading}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Apellido"
                name="lastname"
                onChange={handleChange}
                required
                value={userDetails.lastname}
                variant="outlined"
                disabled={isLoading}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Correo electrónico"
                name="correo_electronico"
                onChange={handleChange}
                required
                value={userDetails.correo_electronico}
                variant="outlined"
                disabled={isLoading}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Número de teléfono"
                name="contact_number"
                onChange={handleChange}
                type="text"
                value={userDetails.contact_number}
                variant="outlined"
                disabled={isLoading}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                onChange={handleChange}
                required
                value={userDetails.address}
                variant="outlined"
                disabled={isLoading}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Por favor especifique el nombre de usuario que utilizara para el acceso al sistema."
                label="Usuario de acceso"
                name="username"
                onChange={handleChange}
                required
                value={userDetails.username}
                variant="outlined"
                disabled={isLoading}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <InputLabel id="pais-label">Seleccione un pais</InputLabel>
              <Select
                labelId="pais-label"
                id="pais"
                variant="outlined"
                name="id_pais"
                fullWidth
                onChange={handleChange}
                value={userDetails.id_pais}
              >
                {paises.map((option) => (
                  <MenuItem key={option.pais_id} value={option.pais_id}>
                    {option.pais}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item md={6} xs={12}>
              <InputLabel id="permisos-label">Permisos</InputLabel>
              <Select
                labelId="permisos-label"
                id="permisos"
                variant="outlined"
                name="rol"
                fullWidth
                onChange={handleChange}
                value={userDetails.rol}
              >
                <MenuItem value="Administrador">Administrador</MenuItem>
                <MenuItem value="Usuario Final">Usuario Final</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isLoading ? true : false}
          >
            Crear Usuario
          </Button>
        </Box>
      </Card>
    </form>
  );
};

RegisterForm.propTypes = {
  className: PropTypes.string,
};

export default memo(RegisterForm);
