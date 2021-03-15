import React, { useState, useContext, useEffect, memo } from "react";
import { Grid, Select, MenuItem } from "@material-ui/core";
import { OrderContext } from "../../Context/OrderContext";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import { useHistory } from "react-router-dom";
import moment from "moment";
import BackdropSpinner from "../BackDrop/backDrop";

function SeleccionPedidos() {
  const [isLoading, setIsLoading] = useState(false);
  const [orden, setOrden] = useContext(OrderContext);
  const [pedidos, setPedidos] = useState([]);
  const history = useHistory();

  const setIdPedido = (id) => {
    setOrden({
      ...orden,
      id_pedido: id,
    });
  };

  useEffect(() => {
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const getdataURL = url.activosPedidosUrl();
    const fetchData = async (url, header, setter) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
      setIsLoading(false);
    };

    fetchData(getdataURL, header, setPedidos);
  }, [history]);

  return (
    <Grid container spacing={2}>
      <BackdropSpinner isLoading={!isLoading} />
      <Grid item xs={12} md={12} lg={12}>
        <Select
          variant="outlined"
          fullWidth
          onChange={(event) => setIdPedido(parseInt(event.target.value))}
          value={orden.id_pedido}
        >
          {pedidos.length > 0 &&
            pedidos.map((pedido) => (
              <MenuItem value={pedido.pedido_id} key={pedido.pedido_id}>{`${
                pedido.pedido_id
              } - ${moment(pedido.fecha).format("MMMM D, YYYY")}`}</MenuItem>
            ))}
        </Select>
      </Grid>
    </Grid>
  );
}

export default memo(SeleccionPedidos);
