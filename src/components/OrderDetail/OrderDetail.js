import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
  Grid,
  Button,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  avatar: {
    height: 100,
    width: 100,
  },
}));

const OrderDetails = ({
  className,
  orden,
  handleChange,
  toggleEditableDetails,
  ordenIsEditable,
  refreshData,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={7} lg={7}>
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardContent>
          <Grid container spacing={2} maxWidth="lg">
            {ordenIsEditable ? (
              <Grid container spacing={2} xs={12} md={12} lg={12}>
                <Grid item xs={12} md={4} lg={4}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    name="nombre_cliente"
                    fullWidth
                    label="Factura a nombre de"
                    value={orden.nombre_cliente}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    name="numero_cliente"
                    fullWidth
                    label="Teléfono"
                    value={orden.numero_cliente}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    name="direccion_cliente"
                    fullWidth
                    label="Dirección"
                    value={orden.direccion_cliente}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            ) : (
              <>
                <Grid item xs={12} md={6} lg={6}>
                  <Box
                    alignItems="flex-start"
                    display="flex"
                    flexDirection="column"
                  >
                    <Typography color="textPrimary" gutterBottom variant="h3">
                      {`Pedido: ${orden.id_pedido}`}
                    </Typography>
                    <Grid xs={12}>
                      <Typography color="textSecondary" variant="body1">
                        {`Vendedor: ${orden.nombre_vendedor}`}
                      </Typography>
                      <Typography color="textSecondary" variant="body1">
                        {`Correo: ${orden.email_vendedor}`}
                      </Typography>
                      <Typography color="textSecondary" variant="body1">
                        {`Tel: ${orden.numero_vendedor}`}
                      </Typography>
                      <Typography color="textSecondary" variant="body1">
                        {`Direccion: ${orden.direccion_vendedor}`}
                      </Typography>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <Box
                    alignItems="flex-start"
                    display="flex"
                    flexDirection="column"
                  >
                    <Typography color="textPrimary" gutterBottom variant="h3">
                      {`Orden: ${orden.id_orden}`}
                    </Typography>
                    <Grid xs={12}>
                      <Typography color="textSecondary" variant="body1">
                        {`A nombre de la factura: ${orden.nombre_cliente}`}
                      </Typography>
                      <Typography color="textSecondary" variant="body1">
                        {`Tel de contacto: ${orden.numero_cliente}`}
                      </Typography>
                      <Typography color="textSecondary" variant="body1">
                        {`Direccion de la factura: ${orden.direccion_cliente}`}
                      </Typography>
                      <Typography color="textSecondary" variant="body1">
                        {`Fecha de creacion: ${moment(
                          orden.fecha_creacion,
                        ).format("DD MMMM, YYYY")}`}
                      </Typography>
                      <Typography color="textSecondary" variant="body1">
                        {`Estado: ${orden.estado}`}
                      </Typography>
                    </Grid>
                  </Box>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Box
                alignItems="center"
                display="flex"
                justifyContent="space-around"
              >
                {ordenIsEditable ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        toggleEditableDetails();
                        refreshData();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={toggleEditableDetails}
                    >
                      Guardar Cambios
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" color="primary">
                      Mover al siguiente estado
                    </Button>
                    <Button variant="contained" onClick={toggleEditableDetails}>
                      Editar datos de factura
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      </Card>
    </Grid>
  );
};

OrderDetails.propTypes = {
  className: PropTypes.string,
};

export default OrderDetails;
