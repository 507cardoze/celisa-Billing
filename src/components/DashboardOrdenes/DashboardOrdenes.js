import React from 'react';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import moment from 'moment';
import * as fetch from '../../helpers/fetch';

const DashboardOrdenes = ({ orden, suma, sumaPagos }) => {
	return (
		<Grid
			item
			container
			xs={12}
			md={5}
			lg={5}
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignContent: 'center',
				width: '100%',
			}}
			spacing={2}
		>
			<Grid item xs={6} md={6} lg={6} style={{ width: '100%', height: '50%' }}>
				<Card style={{ height: '100%' }}>
					<CardContent
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignContent: 'center',
							height: '100%',
						}}
					>
						<Typography color="textSecondary" gutterBottom>
							Último pago:
						</Typography>
						{orden?.pagos.length > 0 ? (
							<Typography variant="h5" component="h2" gutterBottom gutterTop>
								{`$${fetch.numberWithCommas(
									orden.pagos[0].cantidad.toFixed(2),
								)}`}
							</Typography>
						) : (
							<Typography variant="h4" component="h2" gutterBottom gutterTop>
								No se registran pagos aún
							</Typography>
						)}
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={6} md={6} lg={6} style={{ width: '100%', height: '50%' }}>
				<Card style={{ height: '100%' }}>
					<CardContent
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignContent: 'center',
							height: '100%',
						}}
					>
						<Typography color="textSecondary" gutterBottom>
							Última Fecha de pago:
						</Typography>
						{orden?.pagos.length > 0 ? (
							<Typography variant="h5" component="h2" gutterBottom gutterTop>
								{moment(orden.pagos[0].fecha_pago).format('DD-MM-YYYY')}
							</Typography>
						) : (
							<Typography variant="h4" component="h2" gutterBottom gutterTop>
								No se registran pagos aún.
							</Typography>
						)}
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={6} md={6} lg={6} style={{ width: '100%', height: '50%' }}>
				<Card style={{ height: '100%' }}>
					<CardContent
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignContent: 'center',
							height: '100%',
						}}
					>
						<Typography color="textSecondary" gutterBottom>
							Factura total:
						</Typography>
						{orden?.productos.length > 0 ? (
							<Typography variant="h5" component="h2" gutterBottom gutterTop>
								{`$${fetch.numberWithCommas(
									orden.productos.reduce(suma, 0).toFixed(2),
								)}`}
							</Typography>
						) : (
							<Typography variant="h4" component="h2" gutterBottom gutterTop>
								No hay productos registrados en esta orden.
							</Typography>
						)}
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={6} md={6} lg={6} style={{ width: '100%', height: '50%' }}>
				<Card style={{ height: '100%' }}>
					<CardContent
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignContent: 'center',
							height: '100%',
						}}
					>
						<Typography color="textSecondary" gutterBottom>
							Saldo pendiente:
						</Typography>
						{orden?.productos.length > 0 && orden?.pagos.length > 0 ? (
							<Typography variant="h5" component="h2" gutterBottom gutterTop>
								{`$${fetch.numberWithCommas(
									parseFloat(
										parseFloat(orden.productos.reduce(suma, 0)) -
											parseFloat(orden.pagos.reduce(sumaPagos, 0)),
									).toFixed(2),
								)}`}
							</Typography>
						) : orden?.pagos.length > 0 ? (
							<Typography
								variant="h5"
								component="h2"
								gutterBottom
								gutterTop
							>{`$${fetch.numberWithCommas(
								parseFloat(
									0 - parseFloat(orden.pagos.reduce(sumaPagos, 0)),
								).toFixed(2),
							)}`}</Typography>
						) : (
							<Typography variant="h4" component="h2" gutterBottom gutterTop>
								{`${
									orden?.productos.length === 0
										? `Agrege un producto ${
												orden?.pagos.length === 0 ? `.` : ''
										  }`
										: ''
								} ${
									orden?.pagos.length === 0 && orden?.productos.length === 0
										? `y`
										: ''
								} ${orden?.pagos.length === 0 ? `Realice un pago.` : ''}`}
							</Typography>
						)}
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default DashboardOrdenes;
