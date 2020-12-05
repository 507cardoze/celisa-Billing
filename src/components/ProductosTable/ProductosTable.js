import React, { useState } from 'react';
import { Grid, TextField, IconButton, Container, Box } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import { v4 as uuidv4 } from 'uuid';
import * as toast from '../../helpers/toast';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import * as fetch from '../../helpers/fetch';

function ProductosTable({ orden, setOrden, editable = false }) {
	const producto_inicial = {
		id: '',
		descripcion: '',
		talla: '',
		color: '',
		cantidad: 1,
		precio: 0,
	};

	const [productoInput, setProductoInput] = useState(producto_inicial);

	const handleChange = (event) => {
		setProductoInput({
			...productoInput,
			[event.target.name]:
				event.target.name === 'cantidad'
					? Math.round(parseInt(event.target.value))
					: event.target.name === 'precio'
					? parseFloat(event.target.value)
					: event.target.value,
		});
	};

	const addProducto = () => {
		productoInput.id = uuidv4();
		if (
			productoInput.descripcion.trim().length > 0 &&
			productoInput.talla.trim().length > 0 &&
			productoInput.color.trim().length > 0
		) {
			if (orden.productos.length > 0) {
				const verify = orden.productos.filter(
					(producto) =>
						producto.descripcion === productoInput.descripcion.trim(),
				);
				if (verify.length > 0) {
					toast.errorToast('Ya existe un producto igual en la lista.');
				} else {
					setOrden({
						...orden,
						productos: [...orden.productos, productoInput],
					});
					setProductoInput(producto_inicial);
				}
			} else {
				setOrden({
					...orden,
					productos: [...orden.productos, productoInput],
				});
				setProductoInput(producto_inicial);
			}
		} else {
			return toast.errorToast('Debe llenar todos los campos.');
		}
	};

	const deleteProducto = (unique_id) => {
		const nuevoArray = orden.productos.filter(
			(producto) => producto.id !== unique_id,
		);
		setOrden({
			...orden,
			productos: nuevoArray,
		});
	};

	const sumarCantidadProducto = (unique_id) => {
		const nuevoArray = [];
		orden.productos.forEach((producto) => {
			if (producto.id === unique_id) {
				producto.cantidad = producto.cantidad + 1;
				nuevoArray.push(producto);
			} else {
				nuevoArray.push(producto);
			}
		});
		setOrden({
			...orden,
			productos: nuevoArray,
		});
	};

	const restarCantidadProducto = (unique_id) => {
		const nuevoArray = [];
		orden.productos.forEach((producto) => {
			if (producto.id === unique_id) {
				if (producto.cantidad > 1) {
					producto.cantidad = producto.cantidad - 1;
					nuevoArray.push(producto);
				} else {
					nuevoArray.push(producto);
				}
			} else {
				nuevoArray.push(producto);
			}
		});
		setOrden({
			...orden,
			productos: nuevoArray,
		});
	};

	const suma = (acc, cur) => {
		return acc + Number(cur.cantidad) * Number(cur.precio);
	};

	const sumaArticulos = (acc, cur) => {
		return acc + Number(cur.cantidad);
	};

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
										{producto.descripcion}
									</TableCell>
									<TableCell align="right">{producto.talla}</TableCell>
									<TableCell align="right">{producto.color}</TableCell>
									<TableCell align="right">
										<ButtonGroup size="small">
											<Button
												onClick={() => restarCantidadProducto(producto.id)}
											>
												-
											</Button>
											<Button>{`${producto.cantidad}`}</Button>
											<Button
												onClick={() => sumarCantidadProducto(producto.id)}
											>
												+
											</Button>
										</ButtonGroup>
									</TableCell>
									<TableCell align="right">
										{`$${fetch.numberWithCommas(
											parseFloat(producto.precio).toFixed(2),
										)}`}
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
								<TableCell component="th" scope="row"></TableCell>
								<TableCell align="right"></TableCell>
								<TableCell align="right">Articulos: </TableCell>
								<TableCell align="right">{`${fetch.numberWithCommas(
									orden.productos.reduce(sumaArticulos, 0),
								)}`}</TableCell>
								<TableCell align="right" style={{ fontWeight: 'bold' }}>
									Total:
								</TableCell>
								<TableCell align="right" style={{ fontWeight: 'bold' }}>
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
				<Grid container item xs={12} md={12} lg={12}>
					<Grid item xs={6} md={6} lg={6}>
						<Button
							variant="contained"
							color="primary"
							onClick={addProducto}
							disabled={
								productoInput.descripcion.trim().length > 0 &&
								productoInput.talla.trim().length > 0 &&
								productoInput.color.trim().length > 0 &&
								productoInput.precio > 0 &&
								productoInput.cantidad > 0
									? false
									: true
							}
						>
							Agregar nuevo producto
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Container>
	);
}

export default ProductosTable;
