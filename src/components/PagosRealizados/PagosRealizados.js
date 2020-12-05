import React from 'react';
import { Grid, TextField, IconButton, Container, Box } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import * as fetch from '../../helpers/fetch';
import moment from 'moment';

function PagosRealizados({ orden, setOrden, editable = false }) {
	const suma = (acc, cur) => {
		return acc + Number(cur.cantidad);
	};
	return (
		<Container style={{ paddingTop: 20 }}>
			<Box>
				<TableContainer component={Paper}>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Fecha de pago</TableCell>
								<TableCell align="right">Monto&nbsp;($)</TableCell>
								<TableCell align="right">Tipo de pago</TableCell>
								<TableCell align="right">Factura</TableCell>
								<TableCell align="right">Cobrador</TableCell>
								<TableCell align="right">Eliminar</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orden?.pagos?.map((pago) => (
								<TableRow key={pago.pago_id}>
									<TableCell component="th" scope="row">
										{moment(pago.fecha_pago).format('DD-MM-YYYY')}
									</TableCell>
									<TableCell align="right">
										{`$${fetch.numberWithCommas(
											parseFloat(pago.cantidad).toFixed(2),
										)}`}
									</TableCell>
									<TableCell align="right">{pago.tipo}</TableCell>
									<TableCell align="right">recibo de pago aqui</TableCell>
									<TableCell align="right">{`${pago.name} ${pago.lastname}`}</TableCell>
									<TableCell align="right">
										<IconButton
											aria-label="delete"
											//onClick={() => deleteProducto(producto.id)}
										>
											<DeleteIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
							<TableRow>
								<TableCell
									component="th"
									scope="row"
									style={{ fontWeight: 'bold' }}
								>
									Total:
								</TableCell>
								<TableCell
									align="right"
									style={{ fontWeight: 'bold' }}
								>{`$${fetch.numberWithCommas(
									orden.pagos.reduce(suma, 0),
								)}`}</TableCell>
								<TableCell align="right"></TableCell>
								<TableCell align="right" style={{ fontWeight: 'bold' }}>
									Cantidad de pagos:
								</TableCell>
								<TableCell align="right" style={{ fontWeight: 'bold' }}>
									{orden?.pagos.length}
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
				<Grid item>
					<TextField
						variant="outlined"
						type="number"
						name="cantidad"
						label="Cantidad*"
						// value={productoInput.cantidad}
						// onChange={handleChange}
					/>
				</Grid>
				<Grid item>
					<TextField
						variant="outlined"
						type="number"
						name="cantidad"
						label="Tipo de pago*"
						// value={productoInput.cantidad}
						// onChange={handleChange}
					/>
				</Grid>
				<Grid item>
					<TextField
						variant="outlined"
						type="number"
						name="cantidad"
						label="Subir factura*"
						// value={productoInput.cantidad}
						// onChange={handleChange}
					/>
				</Grid>
				<Grid container item xs={12} md={12} lg={12}>
					<Grid item xs={6} md={6} lg={6}>
						<Button variant="contained" color="primary">
							Agregar nuevo pago
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Container>
	);
}

export default PagosRealizados;
