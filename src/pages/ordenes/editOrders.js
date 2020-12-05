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
	const [ordenIsEditable, setOrdenIsEditable] = useState(false);

	const [value, setValue] = useStickyState(0, 'value');

	const handleChangeTab = (event, newValue) => {
		setValue(newValue);
	};

	const urlGet = url.getByIdOrdenUrl();
	const header = fetch.requestHeader('GET', null, localStorage.token);
	const fetchData = async (url, header, setter) => {
		setIsLoading(true);
		const loggedInfo = await fetch.fetchData(url, header);
		fetch.UnauthorizedRedirect(loggedInfo, history);
		setter(loggedInfo);
		setIsLoading(false);
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
	}, [user, history, urlGet, id_orden]);

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
				<BackButton texto="Atras" ruta="/orders" />
				{orden ? (
					<Grid container spacing={2}>
						<OrderDetails
							orden={orden}
							handleChange={handleChangeTab}
							ordenIsEditable={ordenIsEditable}
							toggleEditableDetails={toggleEditableDetails}
							refreshData={refreshData}
						/>
						<DashboardOrdenes orden={orden} suma={suma} sumaPagos={sumaPagos} />
						<Grid item xs={12} style={{ width: '100%' }}>
							<Tabs
								variant="fullWidth"
								value={value}
								onChange={handleChangeTab}
							>
								<Tab label="Productos en la orden" {...a11yProps(0)} />
								<Tab label="Pagos realizados" {...a11yProps(1)} />
							</Tabs>
							<TabPanel value={value} index={0}>
								<ProductosTable orden={orden} setOrden={setOrden} />
							</TabPanel>
							<TabPanel value={value} index={1}>
								<PagosRealizados orden={orden} setOrden={setOrden} />
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
