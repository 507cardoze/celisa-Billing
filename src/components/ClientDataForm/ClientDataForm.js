import React, { useContext, useEffect } from 'react';
import { Grid, InputLabel, Select, MenuItem } from '@material-ui/core';
import { OrderContext } from '../../Context/OrderContext';

function ClientDataForm() {
	const [orden, setOrden] = useContext(OrderContext);

	const setIdPedido = (id) => {
		setOrden({
			...orden,
			id_pedido: id,
		});
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={5} lg={5}></Grid>
		</Grid>
	);
}

export default ClientDataForm;
