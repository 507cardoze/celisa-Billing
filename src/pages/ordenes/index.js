import React, { useState, useEffect, useContext, memo } from 'react';
import { Box, Container } from '@material-ui/core';
import Toolbar from '../../components/ToolBar/Toolbar';
import MainLayout from '../../components/MainLayOut/mainLayout.component';
import DataTable from '../../components/DataTable/databable';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import * as url from '../../helpers/urls';
import * as fetch from '../../helpers/fetch';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { UserContext } from '../../Context/userContext';
import BackdropSpinner from '../../components/BackDrop/backDrop';
import NumericToolBar from '../../components/NumericToolBar/NumericToolBar';
import Chip from '@material-ui/core/Chip';

const Ordenes = () => {
	//state
	const [isLoading, setIsLoading] = useState(false);
	const [rows, setRows] = useState({});
	const [dataExport, setDataExport] = useState([]);
	const [resultados, setResultados] = useState([]);
	const [searchField, setSearchField] = useState('');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(50);
	const [atrib, setAtrib] = useState('orden_id');
	const [order, setOrder] = useState('desc');
	const [estado, setEstado] = useState(0);

	const handleChangePage = (page) => setPage(page++);
	const handleChangeLimit = (limit) => setLimit(limit);
	const handleChangeAtrib = (atrib) => setAtrib(atrib);
	const handleChangeOrder = (order) => setOrder(order);
	const history = useHistory();
	const [user] = useContext(UserContext);

	const { results } = rows;
	const { total } = rows;

	const columns = [
		{ tittle: 'Orden', atributo: 'orden_id' },
		{ tittle: 'Pedido', atributo: 'pedido_id' },
		{ tittle: 'Nombre vendedor', atributo: 'nombre' },
		{ tittle: 'Nombre de factura', atributo: 'nombre_cliente' },
		{ tittle: 'Fecha', atributo: 'fecha' },
		{ tittle: 'Estado', atributo: 'estatus' },
	];

	//funciones
	const headerSearch = fetch.requestHeader('GET', null, localStorage.token);
	const getAllURL = url.getOrdenesUrl();
	const searchUrl = url.searchOrdenesUrl();

	const handleOnChangeTextField = (event) => {
		setSearchField(event.target.value);
		if (searchField.length >= 0) {
			const fetchData = async (url, header, setter) => {
				const loggedInfo = await fetch.fetchData(url, header);
				fetch.UnauthorizedRedirect(loggedInfo, history);
				setter(loggedInfo);
			};
			fetchData(
				`${searchUrl}?text=${searchField}`,
				headerSearch,
				setResultados,
			);
		} else {
			setResultados([]);
		}
	};

	//efectos

	useEffect(() => {
		fetch.UserRedirect(user, history);
		const header = fetch.requestHeader('GET', null, localStorage.token);
		const fetchData = async (url, header, setter) => {
			const loggedInfo = await fetch.fetchData(url, header);
			fetch.UnauthorizedRedirect(loggedInfo, history);
			setter(loggedInfo);
		};
		setIsLoading(true);
		fetchData(
			`${getAllURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}&estado=${estado}`,
			header,
			setRows,
		);
		fetchData(`${getAllURL}?excel=${true}`, header, setDataExport);
		setIsLoading(false);
	}, [user, history, page, limit, atrib, order, getAllURL, estado]);

	return (
		<MainLayout Tittle="Ordenes">
			<Container maxWidth={false}>
				{rows?.dashboard && (
					<NumericToolBar
						setEstado={setEstado}
						ver
						data={{
							titles: [
								{ text: 'Todas las ordenes', estado: 0 },
								{ text: 'Pendiente por aprobacion', estado: 1 },
								{ text: 'Aprobadas', estado: 2 },
								{ text: 'Llego al pais', estado: 3 },
								{ text: 'Saldo Pendiente', estado: 4 },
								{ text: 'Entregados', estado: 5 },
								{ text: 'Cancelados', estado: 6 },
							],
							values: Object.values(rows.dashboard),
						}}
					/>
				)}

				<Toolbar
					isLoading={isLoading}
					resultados={resultados}
					handleOnChangeTextField={handleOnChangeTextField}
					searchField={searchField}
					nav="Agregar Orden"
					ruta="/create-orders"
					searchLabel="Buscar entre todas las ordenes..."
					dataExport={dataExport}
					type="ordenes"
					ordenes
					filename={`ordenes / ${moment().format('MMMM Do YYYY, h:mm')}`}
				/>
				<Box mt={3}>
					<DataTable
						columns={columns}
						total={total}
						page={page}
						limit={limit}
						atrib={atrib}
						order={order}
						handleChangeLimit={handleChangeLimit}
						handleChangePage={handleChangePage}
						handleChangeAtrib={handleChangeAtrib}
						handleChangeOrder={handleChangeOrder}
					>
						{results?.length > 0 ? (
							results.map((row) => (
								<TableRow key={row.orden_id}>
									<TableCell align="center">
										<Chip
											color="primary"
											label={row.orden_id}
											clickable
											onClick={() => {
												history.push(`/edit-orders/${row.orden_id}`);
											}}
										/>
									</TableCell>
									<TableCell align="center">{row.pedido_id}</TableCell>
									<TableCell align="center">{`${row.nombre} ${row.apellido}`}</TableCell>
									<TableCell align="center">{row.nombre_cliente}</TableCell>
									<TableCell align="center">
										{moment(row.fecha).format('MMMM Do YYYY')}
									</TableCell>
									<TableCell align="center">
										<Chip label={row.nombre_status} />
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								{results?.length === 0 ? (
									columns.map((value) => {
										return <TableCell key={value.tittle}></TableCell>;
									})
								) : (
									<BackdropSpinner isLoading={isLoading} />
								)}
							</TableRow>
						)}
					</DataTable>
				</Box>
			</Container>
		</MainLayout>
	);
};

export default memo(Ordenes);
