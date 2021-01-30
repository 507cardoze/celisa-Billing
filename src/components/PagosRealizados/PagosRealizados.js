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
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as toast from '../../helpers/toast';
import DownloadButton from '../../components/DownloadButton/DownloadButton';

function PagosRealizados({
	orden,
	editable = false,
	tipoPago,
	pagoInput,
	setPagoInput,
	addPago,
	deletePago,
}) {
	const suma = (acc, cur) => {
		return acc + Number(cur.cantidad);
	};

	function getBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}

	const convertByteToMb = (number) => {
		return parseFloat(number / 1024 / 1024).toFixed(3);
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
								{editable && <TableCell align="right">Adjunto</TableCell>}
								<TableCell align="right">Cobrador</TableCell>
								{editable && <TableCell align="right">Eliminar</TableCell>}
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
									{editable && (
										<TableCell align="right">
											{pago.adjunto && (
												<DownloadButton
													base64={pago.adjunto}
													filename={`pago#${pago.pago_id} ${moment(
														pago.fecha_pago,
													).format('DD-MM-YYYY')}-${pago.tipo}`}
													label="Descargar"
												/>
											)}
										</TableCell>
									)}
									<TableCell align="right">{`${pago.name} ${pago.lastname}`}</TableCell>
									{editable && (
										<TableCell align="right">
											<IconButton
												aria-label="delete"
												onClick={() => deletePago(pago.pago_id)}
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									)}
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
									orden.pagos.reduce(suma, 0).toFixed(2),
								)}`}</TableCell>
								{editable && <TableCell align="right"></TableCell>}
								<TableCell align="right" style={{ fontWeight: 'bold' }}>
									Cantidad de pagos:
								</TableCell>
								<TableCell align="right" style={{ fontWeight: 'bold' }}>
									{orden?.pagos.length}
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
						display: 'flex',
						justifyContent: 'space-around',
						alignContent: 'center',
					}}
					component={Paper}
				>
					<Grid
						item
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<TextField
							variant="outlined"
							name="cantidad"
							label="Cantidad*"
							type="number"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">$</InputAdornment>
								),
							}}
							value={pagoInput.cantidad}
							onChange={(event) =>
								setPagoInput({
									...pagoInput,
									cantidad: parseFloat(event.target.value),
								})
							}
						/>
					</Grid>
					<Grid
						item
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Select
							fullWidth
							label="Tipo de pago"
							value={pagoInput.tipoPago}
							onChange={(event) =>
								setPagoInput({ ...pagoInput, tipoPago: event.target.value })
							}
						>
							<MenuItem value={0} disabled>
								Selecione un tipo de pago
							</MenuItem>
							{tipoPago.map((tipo) => (
								<MenuItem key={tipo.tipo_id} value={tipo.tipo_id}>
									{tipo.tipo}
								</MenuItem>
							))}
						</Select>
					</Grid>
					{pagoInput.tipoPago !== null &&
						pagoInput.tipoPago !== 1 &&
						pagoInput.tipoPago !== 0 && (
							<Grid
								item
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Button variant="contained" component="label">
									{pagoInput.adjuntoNombre
										? `${pagoInput.adjuntoNombre} ${convertByteToMb(
												pagoInput.adjuntoSize,
										  )}MB`
										: 'Subir adjunto'}
									<input
										type="file"
										hidden
										accept=".jpeg, .png, .jpg, .pdf"
										onChange={(event) => {
											if (event.target.files[0]) {
												if (
													event.target.files[0].type === 'application/pdf' ||
													event.target.files[0].type === 'image/png' ||
													event.target.files[0].type === 'image/jpg' ||
													event.target.files[0].type === 'image/jpeg'
												) {
													if (event.target.files[0].size < parseInt(5242880)) {
														getBase64(event.target.files[0]).then((data) =>
															setPagoInput({
																...pagoInput,
																adjunto: data,
																adjuntoNombre: event.target.files[0].name,
																adjuntoSize: event.target.files[0].size,
															}),
														);
													} else {
														return toast.errorToast(
															'Archivo no puede superar los 5MB.',
														);
													}
												} else {
													return toast.errorToast(
														'Archivo no soportado; Formatos soportados: .jpeg, .png, .jpg, .pdf ',
													);
												}
											}
										}}
									/>
								</Button>
							</Grid>
						)}
					<Grid container item xs={12} md={12} lg={12}>
						<Grid item xs={6} md={6} lg={6}>
							<Button
								variant="contained"
								color="primary"
								onClick={addPago}
								disabled={
									pagoInput.cantidad > 0 && pagoInput.tipoPago
										? pagoInput.tipoPago !== 1
											? pagoInput.adjunto
												? false
												: true
											: false
										: true
								}
							>
								Agregar nuevo pago
							</Button>
						</Grid>
					</Grid>
				</Grid>
			)}
		</Container>
	);
}

export default PagosRealizados;
