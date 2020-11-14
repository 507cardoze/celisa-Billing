import React, { createContext } from 'react';
import { useStickyState } from '../helpers/fetch';

export const OrderContext = createContext();

export const OrderProvider = (props) => {
	const ordenInicial = {
		id_pedido: null,
		productos: [],
		nombre_cliente: '',
		numero_cliente: '',
		direccion_cliente: '',
	};
	const [orden, setOrden] = useStickyState(ordenInicial, 'orden');
	return (
		<OrderContext.Provider value={[orden, setOrden]}>
			{props.children}
		</OrderContext.Provider>
	);
};
