import React, { memo } from "react";
import moment from "moment";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  // MenuItem,
  // FormHelperText,
  // FormControl,
  // Select,
  // Chip,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const OrderDetails = ({
  className,
  orden,
  handleChange,
  admin,
  refreshData,
  status,
  onChangeEstado,
  ...rest
}) => {
  const history = useHistory();
  return (
    <Grid item xs={12} md={7} lg={7}>
      <Card className={className} {...rest} raised style={{ height: "100%" }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
              container
              spacing={2}
            >
              <Grid xs={12} item>
                <Typography color="textPrimary" gutterBottom variant="h3">
                  {`Pedido: ${orden.id_pedido}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`Vendedor: ${orden.nombre_vendedor}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`Tel de vendedor: ${orden.numero_vendedor}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`Fecha de creación: ${moment(orden.fecha_creacion).format(
                    "DD-MM-YYYY",
                  )}`}
                </Typography>
                {/* <Chip color="primary" label={orden.estado} /> */}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
              container
              spacing={2}
            >
              <Grid xs={12} item>
                <Typography color="textPrimary" gutterBottom variant="h3">
                  {`Orden: ${orden.id_orden}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`A nombre de la factura: ${orden.nombre_cliente}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`Tel de contacto: ${orden.numero_cliente}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`Dirección de la factura: ${orden.direccion_cliente}`}
                </Typography>
              </Grid>
              {admin && (
                <Grid xs={12} item>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: ".5rem" }}
                    onClick={() => {
                      history.push(`/clientes/editar/${orden.id_cliente}`);
                    }}
                  >
                    Editar cliente
                  </Button>
                </Grid>
              )}
            </Grid>
            {/* <Grid item xs={12}>
              <Grid
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                width={`100%`}
                container
              >
                {admin && (
                  <Grid item xs={12} md={12} lg={6}>
                    <FormControl
                      style={{
                        margin: 20,
                        minWidth: 120,
                      }}
                    >
                      <Select
                        labelId="estados-label"
                        id="select-estado"
                        value={orden?.estado_id ? orden.estado_id : ""}
                        onChange={(event) => onChangeEstado(event.target.value)}
                        style={{ marginTop: ".5rem" }}
                      >
                        {status.map((estado) => (
                          <MenuItem
                            key={estado.status_id}
                            value={estado.status_id}
                          >
                            {estado.nombre_status}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        ¡Aquí puedes cambiar el estado de la orden!
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
export default memo(OrderDetails);
