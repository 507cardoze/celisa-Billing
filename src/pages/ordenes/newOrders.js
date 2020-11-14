import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import MainLayout from '../../components/MainLayOut/mainLayout.component';
import { useStickyState } from '../../helpers/fetch';
import SeleccionPedidos from '../../components/SeleccionPedidos/SeleccionPedidos';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import { OrderContext } from '../../Context/OrderContext';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
		fontWeight: 'bold',
	},
	actionsContainer: {
		marginBottom: theme.spacing(2),
	},
	resetContainer: {
		padding: theme.spacing(3),
	},
}));

const getSteps = () => {
	return [
		'Selección de pedido',
		'Ingresa los datos del cliente',
		'Ingreso de productos',
		'Revisión de orden',
	];
};

const getStepContent = (step) => {
	switch (step) {
		case 0:
			return <SeleccionPedidos />;

		default:
			return 'Unknown step';
	}
};

function NewOrders() {
	const classes = useStyles();
	const [activeStep, setActiveStep] = useStickyState(0, 'activeStep');
	const steps = getSteps();
	const [orden, setOrden] = useContext(OrderContext);

	const getStepButton = (step) => {
		switch (step) {
			case 0:
				return (
					<Button
						variant="contained"
						color="primary"
						onClick={handleNext}
						className={classes.button}
						disabled={orden.id_pedido === null ? true : false}
					>
						Siguiente
					</Button>
				);
			case 1:
				return (
					<Button
						variant="contained"
						color="primary"
						onClick={handleNext}
						className={classes.button}
						// disabled={
						//   orden.nombre_cliente === "" &&
						//   orden.numero_cliente === "" &&
						//   orden.direccion_cliente === ""
						//   ? true
						//   : false}
					>
						Siguiente
					</Button>
				);
			case 2:
				return (
					<Button
						variant="contained"
						color="primary"
						onClick={handleNext}
						className={classes.button}
						// disabled={
						//   orden.productos.length === 0
						//   ? true
						//   : false}
					>
						Siguiente
					</Button>
				);
			case 3:
				return (
					<Button
						variant="contained"
						color="primary"
						onClick={handleNext}
						className={classes.button}
						// disabled={
						//   orden.productos.length === 0
						//   ? true
						//   : false}
					>
						Completar
					</Button>
				);

			default:
				return `no hay button`;
		}
	};

	const handleNext = () =>
		setActiveStep((prevActiveStep) => prevActiveStep + 1);

	const handleBack = () =>
		setActiveStep((prevActiveStep) => prevActiveStep - 1);

	const handleReset = () => setActiveStep(0);

	const handleResetOrden = () =>
		setOrden({
			id_pedido: null,
			productos: [],
			nombre_cliente: '',
			numero_cliente: '',
			direccion_cliente: '',
		});

	return (
		<MainLayout Tittle="Crear Orden">
			<Stepper activeStep={activeStep} orientation="vertical">
				{steps.map((label, index) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
						<StepContent>
							{getStepContent(index)}
							<div className={classes.actionsContainer}>
								<div>
									<Button
										disabled={activeStep === 0}
										onClick={handleBack}
										className={classes.button}
									>
										Atras
									</Button>
									{getStepButton(activeStep)}
								</div>
							</div>
						</StepContent>
					</Step>
				))}
			</Stepper>
			{activeStep === steps.length && (
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						handleReset();
						handleResetOrden();
					}}
					className={classes.button}
				>
					Crear Nueva Orden
				</Button>
			)}
		</MainLayout>
	);
}

export default NewOrders;
