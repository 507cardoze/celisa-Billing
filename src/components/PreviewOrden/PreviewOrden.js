import React, { useContext } from "react";
import { Grid, Container, Box } from "@material-ui/core";
import { OrderContext } from "../../Context/OrderContext";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

function PreviewOrden() {
  const [orden] = useContext(OrderContext);

  const suma = (acc, cur) => acc + Number(cur.cantidad) * Number(cur.precio);

  const sumaArticulos = (acc, cur) => acc + Number(cur.cantidad);

  return (
    <Container style={{ paddingTop: 20, marginBottom: 30 }}>
      <Grid
        container
        spacing={2}
        style={{
          margintop: 20,
          marginBottom: 20,
          width: " 100%",
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
        }}
        component={Paper}
      >
        <Grid item xs={12} md={12} lg={12}>
          <Typography variant="body2" color="textSecondary" align="center">
            Datos de la factura
          </Typography>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <Typography variant="body1" color="textSecondary" align="left">
            # pedido:
          </Typography>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <Typography
            variant="body1"
            color="textPrimary"
            align="right"
            style={{ fontWeight: "bold" }}
          >
            {orden?.id_pedido}
          </Typography>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <Typography variant="body1" color="textSecondary" align="left">
            Factura a nombre:
          </Typography>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <Typography variant="body1" color="textPrimary" align="right">
            {orden.nombre_cliente}
          </Typography>
        </Grid>

        <Grid item xs={6} md={6} lg={6}>
          <Typography variant="body1" color="textSecondary" align="left">
            Numero de telefono de contacto:
          </Typography>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <Typography variant="body1" color="textPrimary" align="right">
            {orden.numero_cliente}
          </Typography>
        </Grid>

        <Grid item xs={6} md={6} lg={6}>
          <Typography variant="body1" color="textSecondary" align="left">
            Direccion:
          </Typography>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <Typography variant="body1" color="textPrimary" align="right">
            {orden.direccion_cliente}
          </Typography>
        </Grid>
      </Grid>
      <Box component={Paper} style={{ padding: 20 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          style={{ margintop: 20, marginBottom: 20 }}
        >
          Listado de productos en la orden
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Productos (articulo)</TableCell>
                <TableCell align="right">Talla</TableCell>
                <TableCell align="right">Color</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Precio Unitario&nbsp;($)</TableCell>
                <TableCell align="right">Precio Total&nbsp;($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orden?.productos?.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell component="th" scope="row">
                    {producto.descripcion}
                  </TableCell>
                  <TableCell align="right">{producto.talla}</TableCell>
                  <TableCell align="right">{producto.color}</TableCell>
                  <TableCell align="right">{producto.cantidad}</TableCell>
                  <TableCell align="right">
                    {`$${producto.precio.toFixed(2)}`}
                  </TableCell>
                  <TableCell align="right">
                    {`$${(producto.precio * producto.cantidad).toFixed(2)}`}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell component="th" scope="row"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">Articulos: </TableCell>
                <TableCell align="right">{`${orden.productos.reduce(
                  sumaArticulos,
                  0,
                )}`}</TableCell>
                <TableCell align="right" style={{ fontWeight: "bold" }}>
                  Total:
                </TableCell>
                <TableCell align="right" style={{ fontWeight: "bold" }}>
                  {`$${orden.productos.reduce(suma, 0).toFixed(2)}`}
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default PreviewOrden;
