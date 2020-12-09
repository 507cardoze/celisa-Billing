import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../components/MainLayOut/mainLayout.component';
import { Container, Grid, Box, Typography } from '@material-ui/core';
import BackdropSpinner from '../../components/BackDrop/backDrop';
import * as url from '../../helpers/urls';
import * as fetch from '../../helpers/fetch';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../Context/userContext';
import BackButton from '../../components/BackButton/BackButton';
import OrderDetails from '../../components/OrderDetail/OrderDetail';
import DashboardOrdenes from '../../components/DashboardOrdenes/DashboardOrdenes';
import ProductosTable from '../../components/ProductosTable/ProductosTable';
import PagosRealizados from '../../components/PagosRealizados/PagosRealizados';
import { useStickyState } from '../../helpers/fetch';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import * as toast from '../../helpers/toast';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function EditOrder({ match }) {
	const id_orden = parseInt(match.params.id);
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(false);
	const [user] = useContext(UserContext);
	const [orden, setOrden] = useState(null);
	const [proveedores, setProveedores] = useState([]);
	const [status, setStatus] = useState([]);
	const [ordenIsEditable, setOrdenIsEditable] = useState(false);
	const [value, setValue] = useStickyState(0, 'value');
	const producto_inicial = {
		id: '',
		descripcion: '',
		talla: '',
		color: '',
		cantidad: 1,
		precio: 0,
	};

	const [productoInput, setProductoInput] = useState(producto_inicial);

	const urlGet = url.getByIdOrdenUrl();
	const urlProveedores = url.getAllProveedoresUrl();
	const urlStatus = url.getAllStatusUrl();
	const header = fetch.requestHeader('GET', null, localStorage.token);
	const fetchData = async (url, header, setter) => {
		setIsLoading(true);
		const loggedInfo = await fetch.fetchData(url, header);
		fetch.UnauthorizedRedirect(loggedInfo, history);
		setter(loggedInfo);
		setIsLoading(false);
	};

	const toggleEditableDetails = () => {
		return setOrdenIsEditable(!ordenIsEditable);
	};

	const refreshData = () => {
		return fetchData(`${urlGet}/${id_orden}`, header, setOrden);
	};

	const suma = (acc, cur) => {
		return acc + Number(cur.cantidad) * Number(cur.precio);
	};

	const sumaPagos = (acc, cur) => {
		return acc + Number(cur.cantidad);
	};

	const handleChangeTab = (event, newValue) => {
		setValue(newValue);
	};

	const handleChange = (event) => {
		setOrden({
			...orden,
			[event.target.name]: event.target.value,
		});
	};

	const guardarCambiosDetallesFactura = async () => {
		if (orden.nombre_cliente.trim() === '')
			return toast.errorToast('Nombre de factura no puede ir vacio!');
		if (orden.numero_cliente.trim() === '')
			return toast.errorToast('Teléfono no puede ir vacio!');
		if (orden.direccion_cliente.trim() === '')
			return toast.errorToast('Dirección no puede ir vacio!');

		const body = JSON.stringify({
			id_orden: id_orden,
			nombre_cliente: orden.nombre_cliente,
			numero_cliente: orden.numero_cliente,
			direccion_cliente: orden.direccion_cliente,
		});
		const header = fetch.requestHeader('PUT', body, localStorage.token);
		const updateServiceUrl = url.updateOrdenDetailsUrl();
		const loggedInfo = await fetch.fetchData(updateServiceUrl, header);
		fetch.UnauthorizedRedirect(loggedInfo, history);
		if (loggedInfo === 'Detalles Actualizados.') {
			refreshData();
			toggleEditableDetails();
			toast.msgSuccess('Detalles Actualizados.');
		} else {
			toast.errorToast('error al actualizar los datos.');
		}
	};

	const addProducto = async () => {
		if (
			productoInput.descripcion.trim().length === 0 &&
			productoInput.talla.trim().length === 0 &&
			productoInput.color.trim().length === 0
		)
			return toast.errorToast('Debe llenar todos los campos.');

		if (orden.productos.length > 0) {
			const verify = orden.productos.filter(
				(producto) =>
					producto.descripcion === productoInput.descripcion.trim() &&
					producto.talla === productoInput.talla.trim() &&
					producto.color === productoInput.color.trim(),
			);
			if (verify.length > 0)
				return toast.errorToast('Ya existe un producto igual en la lista.');
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
			const header = fetch.requestHeader('POST', body, localStorage.token);
			const urlAddProducto = url.addProductoOrdenUrl();
			const loggedInfo = await fetch.fetchData(urlAddProducto, header);
			fetch.UnauthorizedRedirect(loggedInfo, history);
			if (loggedInfo === 'Producto agregado.') {
				refreshData();
				setProductoInput(producto_inicial);
			} else {
				toast.errorToast('error al agregar producto.');
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
			const header = fetch.requestHeader('PUT', body, localStorage.token);
			const urlCantidad = url.updateCantidadUrl();
			const loggedInfo = await fetch.fetchData(urlCantidad, header);
			fetch.UnauthorizedRedirect(loggedInfo, history);
			if (loggedInfo === 'cantidad actualizada') {
				refreshData();
			} else {
				toast.errorToast('error al sumando producto.');
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
			const header = fetch.requestHeader('PUT', body, localStorage.token);
			const urlCantidad = url.updateCantidadUrl();
			const loggedInfo = await fetch.fetchData(urlCantidad, header);
			fetch.UnauthorizedRedirect(loggedInfo, history);
			if (loggedInfo === 'cantidad actualizada') {
				refreshData();
			} else {
				toast.errorToast('error al sumando producto.');
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
			const header = fetch.requestHeader('PUT', body, localStorage.token);
			const urlDelete = url.deleteProductoUrl();
			const loggedInfo = await fetch.fetchData(urlDelete, header);
			fetch.UnauthorizedRedirect(loggedInfo, history);
			if (loggedInfo === 'Detalles Actualizados.') {
				refreshData();
			} else {
				toast.errorToast('error al eliminar producto.');
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
			const header = fetch.requestHeader('PUT', body, localStorage.token);
			const updateUrl = url.updateProveedorToProductoUrl();
			const loggedInfo = await fetch.fetchData(updateUrl, header);
			fetch.UnauthorizedRedirect(loggedInfo, history);
			if (loggedInfo === 'Detalles Actualizados.') {
				refreshData();
			} else {
				toast.errorToast('error al actualizar proveedor.');
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
			const header = fetch.requestHeader('PUT', body, localStorage.token);
			const updateUrl = url.updateEstadoUrl();
			const loggedInfo = await fetch.fetchData(updateUrl, header);
			fetch.UnauthorizedRedirect(loggedInfo, history);
			if (loggedInfo === 'Detalles Actualizados.') {
				refreshData();
			} else {
				toast.errorToast('error al actualizar estado.');
			}
		} catch (error) {
			console.log(error);
			toast.errorToast(error);
		}
	};

	useEffect(() => {
		fetch.UserRedirect(user, history);
		const header = fetch.requestHeader('GET', null, localStorage.token);
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
	}, [user, history, urlGet, id_orden, urlProveedores, urlStatus]);

	console.log(orden);

	return (
		<MainLayout Tittle={`Orden ${id_orden}`}>
			<Container
				maxWidth="lg"
				style={{
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					flexDirection: 'column',
				}}
			>
				<BackButton
					texto="Atras"
					ruta={user?.rol === 'Administrador' ? `/orders` : `/my-orders`}
				/>
				{orden ? (
					<Grid container spacing={2}>
						<OrderDetails
							orden={orden}
							handleChange={handleChange}
							ordenIsEditable={ordenIsEditable}
							toggleEditableDetails={toggleEditableDetails}
							refreshData={refreshData}
							guardarCambiosDetallesFactura={guardarCambiosDetallesFactura}
							status={status}
							onChangeEstado={onChangeEstado}
						/>
						<DashboardOrdenes orden={orden} suma={suma} sumaPagos={sumaPagos} />
						<Grid item xs={12} style={{ width: '100%' }}>
							<Tabs
								variant="fullWidth"
								value={value}
								onChange={handleChangeTab}
							>
								<Tab label="Productos en esta venta" {...a11yProps(0)} />
								<Tab label="Pagos realizados a esta cuenta" {...a11yProps(1)} />
							</Tabs>
							<TabPanel value={value} index={0}>
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
									editable={user?.rol === 'Administrador' ? true : false}
								/>
							</TabPanel>
							<TabPanel value={value} index={1}>
								<PagosRealizados
									orden={orden}
									setOrden={setOrden}
									editable={user?.rol === 'Administrador' ? true : false}
								/>
							</TabPanel>
						</Grid>
					</Grid>
				) : (
					<BackdropSpinner isLoading={!isLoading} />
				)}
			</Container>
		</MainLayout>
	);
}

export default EditOrder;
