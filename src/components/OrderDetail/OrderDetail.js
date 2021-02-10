import React from "react";
import moment from "moment";
import {
  Card,
  CardContent,
  Divider,
  Typography,
  Grid,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";

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
  return (
    <Grid item xs={12} md={7} lg={7}>
      <Card className={className} {...rest}>
        <CardContent>
          <Grid container spacing={2} maxWidth="false">
            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              alignItems="flex-start"
              display="flex"
              flexDirection="column"
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
                <Chip color="primary" label={orden.estado} />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              alignItems="flex-start"
              display="flex"
              flexDirection="column"
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
            </Grid>
            <Grid item xs={12}>
              <Grid
                alignItems="center"
                display="flex"
                justifyContent="space-between"
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
                        value={orden.estado_id}
                        onChange={(event) => onChangeEstado(event.target.value)}
                        style={{ marginTop: 20 }}
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
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      </Card>
    </Grid>
  );
};
export default OrderDetails;
