import React, { useState, useContext, useEffect } from "react";
import { Grid, Select, MenuItem } from "@material-ui/core";
import { OrderContext } from "../../Context/OrderContext";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import { useHistory } from "react-router-dom";
import moment from "moment";

function SeleccionPedidos() {
  const [orden, setOrden] = useContext(OrderContext);
  const [pedidos, setPedidos] = useState([]);
  const history = useHistory();

  const setIdPedido = (id) => {
    setOrden({
      ...orden,
      id_pedido: id,
    });
  };

  const getdataURL = url.activosPedidosUrl();

  useEffect(() => {
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const fetchData = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
    };
    fetchData(getdataURL, header, setPedidos);
  }, [getdataURL, history]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} lg={12}>
        <Select
          variant="outlined"
          fullWidth
          onChange={(event) => setIdPedido(parseInt(event.target.value))}
          value={orden.id_pedido}
        >
          {pedidos.length > 0 &&
            pedidos.map((pedido) => (
              <MenuItem value={pedido.pedido_id}>{`${
                pedido.pedido_id
              } - ${moment(pedido.fecha).format("MMMM D, YYYY")}`}</MenuItem>
            ))}
        </Select>
      </Grid>
    </Grid>
  );
}

export default SeleccionPedidos;
