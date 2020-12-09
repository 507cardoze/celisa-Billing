import React from 'react';
import moment from 'moment';
import {
	Card,
	CardContent,
	Divider,
	Typography,
	Grid,
	Button,
	TextField,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const OrderDetails = ({
	className,
	orden,
	handleChange,
	toggleEditableDetails,
	ordenIsEditable,
	refreshData,
	guardarCambiosDetallesFactura,
	status,
	onChangeEstado,
	...rest
}) => {
	return (
		<Grid item xs={12} md={7} lg={7}>
			<Card className={className} {...rest}>
				<CardContent>
					<Grid container spacing={2} maxWidth="lg">
						{ordenIsEditable ? (
							<Grid container spacing={2} xs={12} md={12} lg={12}>
								<Grid item xs={12} md={4} lg={4}>
									<TextField
										variant="outlined"
										margin="normal"
										name="nombre_cliente"
										fullWidth
										label="Factura a nombre de"
										value={orden.nombre_cliente}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} md={4} lg={4}>
									<TextField
										variant="outlined"
										margin="normal"
										name="numero_cliente"
										fullWidth
										label="Teléfono"
										value={orden.numero_cliente}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} md={8} lg={8}>
									<TextField
										variant="outlined"
										margin="normal"
										name="direccion_cliente"
										fullWidth
										label="Dirección"
										value={orden.direccion_cliente}
										onChange={handleChange}
									/>
								</Grid>
							</Grid>
						) : (
							<>
								<Grid
									item
									xs={12}
									md={6}
									lg={6}
									alignItems="flex-start"
									display="flex"
									flexDirection="column"
									container
									spacing={2}
								>
									<Grid xs={12} item>
										<Typography color="textPrimary" gutterBottom variant="h3">
											{`Pedido: ${orden.id_pedido}`}
										</Typography>
										<Typography color="textSecondary" variant="body1">
											{`Vendedor: ${orden.nombre_vendedor}`}
										</Typography>
										<Typography color="textSecondary" variant="body1">
											{`Tel de vendedor: ${orden.numero_vendedor}`}
										</Typography>
										<Typography color="textSecondary" variant="body1">
											{`Fecha de creación: ${moment(
												orden.fecha_creacion,
											).format('DD-MM-YYYY')}`}
										</Typography>
										<Chip color="primary" label={orden.estado} />
									</Grid>
								</Grid>
								<Grid
									item
									xs={12}
									md={6}
									lg={6}
									alignItems="flex-start"
									display="flex"
									flexDirection="column"
									container
									spacing={2}
								>
									<Grid xs={12} item>
										<Typography color="textPrimary" gutterBottom variant="h3">
											{`Orden: ${orden.id_orden}`}
										</Typography>
										<Typography color="textSecondary" variant="body1">
											{`A nombre de la factura: ${orden.nombre_cliente}`}
										</Typography>
										<Typography color="textSecondary" variant="body1">
											{`Tel de contacto: ${orden.numero_cliente}`}
										</Typography>
										<Typography color="textSecondary" variant="body1">
											{`Dirección de la factura: ${orden.direccion_cliente}`}
										</Typography>
									</Grid>
								</Grid>
							</>
						)}
						<Grid item xs={12}>
							<Grid
								alignItems="center"
								display="flex"
								justifyContent="space-between"
								width={`100%`}
								container
							>
								{ordenIsEditable ? (
									<>
										<Grid item xs={6} md={6} lg={6}>
											<Button
												variant="contained"
												onClick={() => {
													toggleEditableDetails();
													refreshData();
												}}
											>
												Cancelar
											</Button>
										</Grid>
										<Grid item xs={6} md={6} lg={6}>
											<Button
												variant="contained"
												color="primary"
												onClick={guardarCambiosDetallesFactura}
											>
												Guardar Cambios
											</Button>
										</Grid>
									</>
								) : (
									<>
										<Grid item xs={12} md={12} lg={6}>
											<FormControl
												style={{
													margin: 20,
													minWidth: 120,
												}}
											>
												<Select
													labelId="estados-label"
													id="select-estado"
													value={orden.estado_id}
													onChange={(event) =>
														onChangeEstado(event.target.value)
													}
													style={{ marginTop: 20 }}
												>
													{status.map((estado) => (
														<MenuItem
															key={estado.status_id}
															value={estado.status_id}
														>
															{estado.nombre_status}
														</MenuItem>
													))}
												</Select>
												<FormHelperText>
													¡Aquí puedes cambiar el estado de la orden!
												</FormHelperText>
											</FormControl>
										</Grid>
										<Grid item xs={12} md={12} lg={6}>
											<Button
												variant="contained"
												onClick={toggleEditableDetails}
											>
												Editar datos de factura
											</Button>
										</Grid>
									</>
								)}
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
				<Divider />
			</Card>
		</Grid>
	);
};
export default OrderDetails;
