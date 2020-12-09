import React from 'react';
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
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import * as fetch from '../../helpers/fetch';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

function ProductosTable({
	orden,
	editable = false,
	addProducto,
	productoInput,
	setProductoInput,
	sumarCantidadProducto,
	restarCantidadProducto,
	deleteProducto,
	proveedores,
	onChangeProveedor,
}) {
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
								<TableCell align={editable ? 'center' : 'right'}>
									Cantidad
								</TableCell>
								{editable && <TableCell align="right">Proveedor</TableCell>}
								<TableCell align="right">Precio Unitario&nbsp;($)</TableCell>
								<TableCell align="right">Precio Total&nbsp;($)</TableCell>
								{editable && <TableCell align="right">Eliminar</TableCell>}
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
										{editable ? (
											<ButtonGroup size="small">
												<Button
													onClick={() => {
														if (producto.cantidad > 1) {
															restarCantidadProducto(
																producto.linea_id,
																producto.cantidad,
															);
														}
													}}
												>
													<RemoveIcon fontSize="small" />
												</Button>
												<Button>{`${producto.cantidad}`}</Button>
												<Button
													onClick={() =>
														sumarCantidadProducto(
															producto.linea_id,
															producto.cantidad,
														)
													}
												>
													<AddIcon fontSize="small" />
												</Button>
											</ButtonGroup>
										) : (
											producto.cantidad
										)}
									</TableCell>
									{editable && (
										<TableCell align="right">
											<Select
												label="Proveedor"
												value={producto.proveedor_id}
												onChange={(event) =>
													onChangeProveedor(
														event.target.value,
														producto.linea_id,
													)
												}
											>
												<MenuItem value={null}>
													<em>Sin proveedor</em>
												</MenuItem>
												{proveedores.map((proveedor) => (
													<MenuItem
														key={proveedor.proveedor_id}
														value={proveedor.proveedor_id}
													>
														{proveedor.proveedor}
													</MenuItem>
												))}
											</Select>
										</TableCell>
									)}

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
									{editable && (
										<TableCell align="right">
											<IconButton
												aria-label="delete"
												onClick={() => deleteProducto(producto.linea_id)}
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									)}
								</TableRow>
							))}
							<TableRow>
								<TableCell component="th" scope="row"></TableCell>
								<TableCell align="right"></TableCell>
								<TableCell align="right">Articulos: </TableCell>
								<TableCell align="right">{`${fetch.numberWithCommas(
									orden.productos.reduce(sumaArticulos, 0),
								)}`}</TableCell>
								<TableCell align="right"></TableCell>
								<TableCell align="right" style={{ fontWeight: 'bold' }}>
									TOTAL:
								</TableCell>
								<TableCell align="right" style={{ fontWeight: 'bold' }}>
									{`$${fetch.numberWithCommas(
										orden.productos.reduce(suma, 0).toFixed(2),
									)}`}
								</TableCell>
								{editable && <TableCell align="right"></TableCell>}
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Box>

			{editable && (
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
			)}
		</Container>
	);
}

export default ProductosTable;
