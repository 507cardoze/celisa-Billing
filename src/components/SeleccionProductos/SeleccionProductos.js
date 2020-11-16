import React, { useContext } from "react";
import { Grid, TextField } from "@material-ui/core";
import { OrderContext } from "../../Context/OrderContext";
import { CustomButton } from "../../components/BackButton/BackButton";
import { useStickyState } from "../../helpers/fetch";
import InputAdornment from "@material-ui/core/InputAdornment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function SeleccionProductos() {
  const [orden, setOrden] = useContext(OrderContext);
  const producto_inicial = {
    descripcion: "",
    talla: "",
    color: "",
    cantidad: 1,
    precio: 0.0,
  };

  const [productoInput, setProductoInput] = useStickyState(
    producto_inicial,
    "productoInput",
  );

  const handleChange = (event) => {
    setProductoInput({
      ...productoInput,
      [event.target.name]:
        event.target.name === "cantidad"
          ? Math.round(parseInt(event.target.value))
          : event.target.name === "precio"
          ? parseFloat(event.target.value)
          : event.target.value,
    });
  };

  const setInicial = () => {
    return setProductoInput(producto_inicial);
  };

  const addProducto = () => {
    setProductoInput(producto_inicial);
    setOrden({
      ...orden,
      productos: [...orden.productos, productoInput],
    });
  };

  return (
    <Grid spacing={2} container xs={12} md={12} lg={12}>
      <Grid xs={12} md={12} lg={12}>
        {orden.productos?.length > 0 ? (
          <Grid
            xs={12}
            md={12}
            lg={12}
            container
            spacing={2}
            style={{
              marginTop: 5,
              paddingLeft: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TableContainer component={Paper}>
              <Table style={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Productos (articulo)</TableCell>
                    <TableCell align="right">Talla</TableCell>
                    <TableCell align="right">Color</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio&nbsp;($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orden.productos.map((producto) => (
                    <TableRow key={producto.descripcion}>
                      <TableCell component="th" scope="row">
                        {producto.descripcion}
                      </TableCell>
                      <TableCell align="right">{producto.talla}</TableCell>
                      <TableCell align="right">{producto.color}</TableCell>
                      <TableCell align="right">{`${producto.cantidad}x`}</TableCell>
                      <TableCell align="right">
                        {(producto.precio * producto.cantidad).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ) : (
          <Grid
            xs={12}
            md={12}
            lg={12}
            container
            spacing={2}
            style={{
              marginTop: 5,
              paddingLeft: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p>No ha seleccionado productos</p>
          </Grid>
        )}
      </Grid>
      <Grid
        xs={12}
        md={12}
        lg={12}
        container
        spacing={2}
        style={{
          marginBottom: 20,
          marginTop: 20,
        }}
      >
        <Grid item xs={12} md={4} lg={4}>
          <TextField
            variant="outlined"
            name="descripcion"
            label="Descripcion del producto"
            value={productoInput.descripcion}
            onChange={handleChange}
            autoFocus
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={6} lg={2}>
          <TextField
            variant="outlined"
            name="talla"
            label="Talla"
            value={productoInput.talla}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6} md={6} lg={2}>
          <TextField
            variant="outlined"
            name="color"
            label="Color"
            value={productoInput.color}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={8} md={8} lg={2}>
          <TextField
            variant="outlined"
            type="number"
            name="cantidad"
            label="Cantidad"
            value={productoInput.cantidad}
            onChange={handleChange}
            style={{ width: "10ch" }}
          />
        </Grid>

        <Grid item xs={8} md={8} lg={2}>
          <TextField
            variant="outlined"
            name="precio"
            label="Precio"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            value={productoInput.precio}
            onChange={handleChange}
            style={{ width: "15ch" }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <CustomButton
            text="Limpiar"
            style={{ padding: 10, marginRight: 10 }}
            onClick={setInicial}
          />
          <CustomButton
            text="Agregar"
            style={{ padding: 10 }}
            onClick={addProducto}
            disabled={
              productoInput.descripcion.length > 0 &&
              productoInput.talla.length > 0 &&
              productoInput.color.length > 0 &&
              productoInput.cantidad >= 1 &&
              productoInput.precio >= 0
                ? true
                : false
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default SeleccionProductos;
