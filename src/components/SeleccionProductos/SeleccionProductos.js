import React, { useContext } from "react";
import {
  Grid,
  TextField,
  IconButton,
  Container,
  Box,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ButtonGroup,
  Button,
} from "@material-ui/core";
import { OrderContext } from "../../Context/OrderContext";
import { CustomButton } from "../../components/BackButton/BackButton";
import { v4 as uuidv4 } from "uuid";
import * as toast from "../../helpers/toast";
import * as fetch from "../../helpers/fetch";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";

function SeleccionProductos() {
  const [orden, setOrden] = useContext(OrderContext);
  const producto_inicial = {
    id: "",
    descripcion: "",
    talla: "",
    color: "",
    cantidad: 1,
    precio: 0,
  };

  const [productoInput, setProductoInput] = fetch.useStickyState(
    producto_inicial,
    "productoInput",
  );

  const handleChange = (event) =>
    setProductoInput({
      ...productoInput,
      [event.target.name]:
        event.target.name === "cantidad"
          ? Math.round(parseInt(event.target.value))
          : event.target.name === "precio"
          ? parseFloat(event.target.value)
          : event.target.value,
    });

  const addProducto = () => {
    productoInput.id = uuidv4();
    if (
      productoInput.descripcion.trim().length > 0 &&
      productoInput.talla.trim().length > 0 &&
      productoInput.color.trim().length > 0
    ) {
      const verify = orden.productos.filter(
        (producto) =>
          producto.descripcion === productoInput.descripcion.trim() &&
          producto.talla === productoInput.talla.trim() &&
          producto.color === productoInput.color.trim(),
      );
      if (verify.length > 0)
        return toast.errorToast("Ya existe un producto igual en la lista.");
      setOrden({
        ...orden,
        productos: [...orden.productos, productoInput],
      });
      setProductoInput(producto_inicial);
    } else {
      return toast.errorToast("Debe llenar todos los campos.");
    }
  };

  const deleteProducto = (unique_id) => {
    setOrden({
      ...orden,
      productos: orden.productos.filter(
        (producto) => producto.id !== unique_id,
      ),
    });
  };

  const sumarCantidadProducto = (unique_id) => {
    setOrden({
      ...orden,
      productos: orden.productos.map((producto) => {
        if (producto.id === unique_id) {
          producto.cantidad = producto.cantidad + 1;
          return producto;
        } else {
          return producto;
        }
      }),
    });
  };

  const restarCantidadProducto = (unique_id) => {
    setOrden({
      ...orden,
      productos: orden.productos.map((producto) => {
        if (producto.id === unique_id && producto.cantidad > 1) {
          producto.cantidad = producto.cantidad - 1;
          return producto;
        } else {
          return producto;
        }
      }),
    });
  };

  const handleEditText = (event, unique_id, text) => {
    setOrden({
      ...orden,
      productos: orden.productos.map((producto) => {
        if (producto.id === unique_id) {
          if (text === "precio") {
            producto[text] = parseFloat(event.target.value);
          } else {
            producto[text] = event.target.value;
          }
          return producto;
        } else {
          return producto;
        }
      }),
    });
  };

  const deleteAllProductos = () =>
    setOrden({
      ...orden,
      productos: [],
    });

  const suma = (acc, cur) => acc + Number(cur.cantidad) * Number(cur.precio);

  const sumaArticulos = (acc, cur) => acc + Number(cur.cantidad);

  return (
    <Container style={{ paddingTop: 20 }}>
      <Box>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Productos (articulo)</TableCell>
                <TableCell align="right">Talla</TableCell>
                <TableCell align="right">Color</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="right">Precio Unitario&nbsp;($)</TableCell>
                <TableCell align="right">Precio Total&nbsp;($)</TableCell>
                <TableCell align="right">Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orden?.productos?.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell component="th" scope="row">
                    <TextField
                      variant="outlined"
                      name="descripcion"
                      value={producto.descripcion}
                      size="small"
                      fullWidth
                      onChange={(event) =>
                        handleEditText(event, producto.id, "descripcion")
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      variant="outlined"
                      name="talla"
                      size="small"
                      value={producto.talla}
                      onChange={(event) =>
                        handleEditText(event, producto.id, "talla")
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      variant="outlined"
                      name="color"
                      size="small"
                      value={producto.color}
                      onChange={(event) =>
                        handleEditText(event, producto.id, "color")
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ButtonGroup size="small">
                      <Button
                        onClick={() => restarCantidadProducto(producto.id)}
                      >
                        <RemoveIcon fontSize="small" />
                      </Button>
                      <Button>{`${producto.cantidad}`}</Button>
                      <Button
                        onClick={() => sumarCantidadProducto(producto.id)}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      variant="outlined"
                      name="precio"
                      label="Precio*"
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      value={producto.precio}
                      onChange={(event) =>
                        handleEditText(event, producto.id, "precio")
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    {`$${fetch.numberWithCommas(
                      parseFloat(producto.precio * producto.cantidad).toFixed(
                        2,
                      ),
                    )}`}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteProducto(producto.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell component="th" scope="row">
                  {orden?.productos?.length > 0 && (
                    <CustomButton
                      text="Quitar todos"
                      style={{
                        marginRight: 10,
                        backgroundColor: "white",
                      }}
                      onClick={deleteAllProductos}
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">Articulos: </TableCell>
                <TableCell align="right">{`${fetch.numberWithCommas(
                  orden.productos.reduce(sumaArticulos, 0),
                )}`}</TableCell>
                <TableCell align="right" style={{ fontWeight: "bold" }}>
                  Total:
                </TableCell>
                <TableCell align="right" style={{ fontWeight: "bold" }}>
                  {`$${fetch.numberWithCommas(
                    orden.productos.reduce(suma, 0).toFixed(2),
                  )}`}
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Grid
        item
        xs={12}
        md={12}
        lg={12}
        container
        spacing={2}
        style={{
          marginBottom: 20,
          marginTop: 20,
        }}
        component={Paper}
      >
        <Grid item xs={12} md={4} lg={4}>
          <TextField
            variant="outlined"
            name="descripcion"
            label="Descripción*"
            value={productoInput.descripcion}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <TextField
            variant="outlined"
            name="talla"
            label="Talla*"
            value={productoInput.talla}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={2}>
          <TextField
            variant="outlined"
            name="color"
            label="Color*"
            value={productoInput.color}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={2}>
          <TextField
            variant="outlined"
            type="number"
            name="cantidad"
            label="Cantidad*"
            value={productoInput.cantidad}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={2}>
          <TextField
            variant="outlined"
            name="precio"
            label="Precio*"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            value={productoInput.precio}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <CustomButton
            text="Agregar"
            style={{
              padding: 10,
            }}
            onClick={addProducto}
            size="small"
            disabled={
              productoInput.descripcion.trim().length > 0 &&
              productoInput.talla.trim().length > 0 &&
              productoInput.color.trim().length > 0 &&
              productoInput.precio > 0 &&
              productoInput.cantidad > 0
                ? false
                : true
            }
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default SeleccionProductos;
