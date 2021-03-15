import React, { useState, useEffect, useContext, memo } from "react";
import { Container, Grid, Box, Tabs, Tab } from "@material-ui/core";
import * as toast from "../../helpers/toast";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import { useHistory, Route } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import BackButton from "../../components/BackButton/BackButton";
import OrderDetails from "../../components/OrderDetail/OrderDetail";
import DashboardOrdenes from "../../components/DashboardOrdenes/DashboardOrdenes";
import ProductosTable from "../../components/ProductosTable/ProductosTable";
import PagosRealizados from "../../components/PagosRealizados/PagosRealizados";
import EditProducto from "../../components/EditProducto/EditProducto";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

function EditOrder(props) {
  const { match } = props;
  const id_orden = parseInt(match.params.id);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useContext(UserContext);
  const [orden, setOrden] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [status, setStatus] = useState([]);
  const [tipoPago, setTipoPago] = useState([]);
  const [value, setValue] = fetch.useStickyState(0, "value");
  const producto_inicial = {
    id: "",
    descripcion: "",
    talla: "",
    color: "",
    cantidad: 1,
    precio: 0,
  };

  const pago_inicial = {
    cantidad: 0,
    tipoPago: 0,
    adjunto: null,
    adjuntoNombre: null,
    comentarios: "",
  };

  const [productoInput, setProductoInput] = useState(producto_inicial);
  const [pagoInput, setPagoInput] = useState(pago_inicial);

  const urlGet = url.getByIdOrdenUrl();
  const urlProveedores = url.getAllProveedoresUrl();
  const urlStatus = url.getAllStatusUrl();
  const urlTipo = url.getAllTipoPagoUrl();
  const header = fetch.requestHeader("GET", null, localStorage.token);
  const fetchDataOff = async (url, header, setter) => {
    setIsLoading(false);
    const loggedInfo = await fetch.fetchData(url, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    setter(loggedInfo);
    setIsLoading(true);
  };

  const refreshData = () =>
    fetchDataOff(`${urlGet}/${id_orden}`, header, setOrden);

  const suma = (acc, cur) => acc + Number(cur.cantidad) * Number(cur.precio);

  const sumaPagos = (acc, cur) => acc + Number(cur.cantidad);

  const handleChangeTab = (event, newValue) => setValue(newValue);

  const handleChange = (event) =>
    setOrden({
      ...orden,
      [event.target.name]: event.target.value,
    });

  const addProducto = async () => {
    if (
      productoInput.descripcion.trim().length === 0 &&
      productoInput.talla.trim().length === 0 &&
      productoInput.color.trim().length === 0
    )
      return toast.errorToast("Debe llenar todos los campos.");

    if (orden.productos.length > 0) {
      const verify = orden.productos.filter(
        (producto) =>
          producto.descripcion === productoInput.descripcion.trim() &&
          producto.talla === productoInput.talla.trim() &&
          producto.color === productoInput.color.trim(),
      );
      if (verify.length > 0)
        return toast.errorToast("Ya existe un producto igual en la lista.");
    }

    try {
      const body = JSON.stringify({
        id_orden: id_orden,
        pedido_id: orden.id_pedido,
        producto: productoInput.descripcion,
        talla: productoInput.talla,
        color: productoInput.color,
        cantidad: productoInput.cantidad,
        precio: productoInput.precio,
      });
      const header = fetch.requestHeader("POST", body, localStorage.token);
      const urlAddProducto = url.addProductoOrdenUrl();
      const loggedInfo = await fetch.fetchData(urlAddProducto, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      if (loggedInfo === "Producto agregado.") {
        await refreshData();
        setProductoInput(producto_inicial);
        toast.msgSuccess("Producto agregado correctamente.");
      } else {
        toast.errorToast("error al agregar producto.");
      }
    } catch (error) {
      console.log(error);
      toast.errorToast(error);
    }
  };

  const sumarCantidadProducto = async (unique_id, cantidad) => {
    try {
      const body = JSON.stringify({
        linea_id: unique_id,
        decision: 1,
        cantidad: cantidad,
      });
      const header = fetch.requestHeader("PUT", body, localStorage.token);
      const urlCantidad = url.updateCantidadUrl();
      const loggedInfo = await fetch.fetchData(urlCantidad, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      if (loggedInfo === "cantidad actualizada") {
        await refreshData();
      } else {
        toast.errorToast("error al sumando producto.");
      }
    } catch (error) {
      console.log(error);
      toast.errorToast(error);
    }
  };

  const restarCantidadProducto = async (unique_id, cantidad) => {
    try {
      const body = JSON.stringify({
        linea_id: unique_id,
        decision: 0,
        cantidad: cantidad,
      });
      const header = fetch.requestHeader("PUT", body, localStorage.token);
      const urlCantidad = url.updateCantidadUrl();
      const loggedInfo = await fetch.fetchData(urlCantidad, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      if (loggedInfo === "cantidad actualizada") {
        await refreshData();
      } else {
        toast.errorToast("error al sumando producto.");
      }
    } catch (error) {
      console.log(error);
      toast.errorToast(error);
    }
  };

  const deleteProducto = async (unique_id) => {
    try {
      const body = JSON.stringify({
        linea_id: unique_id,
      });
      const header = fetch.requestHeader("PUT", body, localStorage.token);
      const urlDelete = url.deleteProductoUrl();
      const loggedInfo = await fetch.fetchData(urlDelete, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      if (loggedInfo === "Detalles Actualizados.") {
        await refreshData();
      } else {
        toast.errorToast("error al eliminar producto.");
      }
    } catch (error) {
      console.log(error);
      toast.errorToast(error);
    }
  };

  const onChangeProveedor = async (proveedor_id, unique_id) => {
    try {
      const body = JSON.stringify({
        linea_id: unique_id,
        proveedor_id: proveedor_id,
      });
      const header = fetch.requestHeader("PUT", body, localStorage.token);
      const updateUrl = url.updateProveedorToProductoUrl();
      const loggedInfo = await fetch.fetchData(updateUrl, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      if (loggedInfo === "Detalles Actualizados.") {
        await refreshData();
      } else {
        toast.errorToast("error al actualizar proveedor.");
      }
    } catch (error) {
      console.log(error);
      toast.errorToast(error);
    }
  };

  const onChangeEstado = async (estado) => {
    try {
      const body = JSON.stringify({
        id_orden: id_orden,
        estado_id: estado,
      });
      const header = fetch.requestHeader("PUT", body, localStorage.token);
      const updateUrl = url.updateEstadoUrl();
      const loggedInfo = await fetch.fetchData(updateUrl, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      if (loggedInfo === "Detalles Actualizados.") {
        await refreshData();
      } else {
        toast.errorToast("error al actualizar estado.");
      }
    } catch (error) {
      console.log(error);
      toast.errorToast(error);
    }
  };

  const addPago = async () => {
    if (pagoInput.tipoPago === 1) {
      setPagoInput({
        ...pagoInput,
        adjunto: null,
        adjuntoNombre: null,
        adjuntoSize: null,
      });
    }

    try {
      const body = JSON.stringify({
        id_orden: id_orden,
        adjunto: pagoInput.adjunto,
        id_tipo: pagoInput.tipoPago,
        id_pedido: orden.id_pedido,
        cantidad: pagoInput.cantidad,
        comentarios: pagoInput.comentarios,
      });
      const header = fetch.requestHeader("POST", body, localStorage.token);
      const pagoUrl = url.agregarPagosUrl();
      const loggedInfo = await fetch.fetchData(pagoUrl, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      if (loggedInfo === "Pago realizado.") {
        await refreshData();
        setPagoInput(pago_inicial);
        toast.msgSuccess("Pago agregado correctamente.");
      } else {
        toast.errorToast(loggedInfo);
      }
    } catch (error) {
      console.log(error);
      toast.errorToast(error);
    }
  };

  const deletePago = async (unique_id) => {
    try {
      const body = JSON.stringify({
        pago_id: unique_id,
      });
      const header = fetch.requestHeader("PUT", body, localStorage.token);
      const urlDelete = url.deletePagoUrl();
      const loggedInfo = await fetch.fetchData(urlDelete, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      if (loggedInfo === "Detalles Actualizados.") {
        await refreshData();
      } else {
        toast.errorToast("error al eliminar pago.");
      }
    } catch (error) {
      console.log(error);
      toast.errorToast(error);
    }
  };

  useEffect(() => {
    //fetch.UserRedirect(user, history);
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const fetchData = async (url, header, setter) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
      setIsLoading(false);
    };

    fetchData(`${urlGet}/${id_orden}`, header, setOrden);
    fetchData(urlProveedores, header, setProveedores);
    fetchData(urlStatus, header, setStatus);
    fetchData(urlTipo, header, setTipoPago);
  }, [user, history, urlGet, id_orden, urlProveedores, urlStatus, urlTipo]);

  return (
    <MainLayout Tittle={`Orden ${id_orden}`}>
      <Container
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        <Grid>
          <BackButton
            texto="Atras"
            style={{ marginRight: "1rem" }}
            ruta={user?.rol === "Administrador" ? `/orders` : `/my-orders`}
          />
          {user?.rol === "Administrador" ? (
            <BackButton
              style={{ backgroundColor: "#ffffff" }}
              texto="Factura en PDF"
              ruta={`/factura/${id_orden}`}
            />
          ) : null}
        </Grid>

        {orden ? (
          <Grid container spacing={2}>
            <OrderDetails
              orden={orden}
              handleChange={handleChange}
              refreshData={refreshData}
              status={status}
              onChangeEstado={onChangeEstado}
              admin={user?.rol === "Administrador" ? true : false}
            />
            <DashboardOrdenes orden={orden} suma={suma} sumaPagos={sumaPagos} />
            <Grid item xs={12} style={{ width: "100%" }}>
              <Tabs
                variant="fullWidth"
                value={value}
                onChange={handleChangeTab}
              >
                <Tab label="Productos en esta venta" {...a11yProps(0)} />
                <Tab label="Pagos realizados a esta cuenta" {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                <Route
                  exact
                  path={`${match.path}`}
                  render={(props) => (
                    <ProductosTable
                      addProducto={addProducto}
                      orden={orden}
                      productoInput={productoInput}
                      setProductoInput={setProductoInput}
                      sumarCantidadProducto={sumarCantidadProducto}
                      restarCantidadProducto={restarCantidadProducto}
                      deleteProducto={deleteProducto}
                      proveedores={proveedores}
                      onChangeProveedor={onChangeProveedor}
                      editable={user?.rol === "Administrador" ? true : false}
                      {...props}
                    />
                  )}
                />
                <Route
                  path={`${match.path}/editar/:linea_id`}
                  render={(props) => (
                    <EditProducto refreshData={refreshData} {...props} />
                  )}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <PagosRealizados
                  orden={orden}
                  setOrden={setOrden}
                  editable={user?.rol === "Administrador" ? true : false}
                  tipoPago={tipoPago}
                  pagoInput={pagoInput}
                  setPagoInput={setPagoInput}
                  addPago={addPago}
                  deletePago={deletePago}
                />
              </TabPanel>
            </Grid>
          </Grid>
        ) : (
          <BackdropSpinner isLoading={isLoading} />
        )}
      </Container>
    </MainLayout>
  );
}

export default memo(EditOrder);
