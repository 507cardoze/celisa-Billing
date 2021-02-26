import React, { useState, useContext, memo } from "react";
import { Box, Container } from "@material-ui/core";
import Toolbar from "../../components/ToolBar/Toolbar";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import DataTable from "../../components/DataTable/databable";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../../Context/userContext";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import * as toast from "../../helpers/toast";
import Chip from "@material-ui/core/Chip";
import NumericToolBar from "../../components/NumericToolBar/NumericToolBar";
import { useQuery } from "react-query";
import { useIsFetching } from "react-query";

const Pedidos = () => {
  //state
  const [resultados, setResultados] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [atrib, setAtrib] = useState("pedido_id");
  const [order, setOrder] = useState("desc");

  const handleChangePage = (page) => setPage(page++);
  const handleChangeLimit = (limit) => setLimit(limit);
  const handleChangeAtrib = (atrib) => setAtrib(atrib);
  const handleChangeOrder = (order) => setOrder(order);
  const history = useHistory();
  const [user] = useContext(UserContext);
  const isFetching = useIsFetching();

  const columns = [
    { tittle: "#", atributo: "pedido_id" },
    { tittle: "Fecha", atributo: "fecha" },
    { tittle: "Gasto de Operación", atributo: "gasto_operacion" },
    { tittle: "Estado", atributo: "estatus" },
  ];

  //funciones

  const getAllPedidoURL = url.getPedidosUrl();

  const searchUrl = url.searchPedidosUrl();

  const pedidos = {
    add: () => handleOnClickNuevoPedido(),
    closeAll: () => handleOnClickClosePedido(),
  };

  const handleOnChangeTextField = async (event) => {
    setSearchField(event.target.value);
    if (searchField.length >= 0) {
      const response = await searchPedido(`${searchUrl}?text=${searchField}`);
      setResultados(response);
    } else {
      setResultados([]);
    }
  };

  const handleOnClickNuevoPedido = async () => {
    const query = await addPedido();
    if (query === "pedido creado") {
      refetch();
    } else {
      toast.errorToast(query);
    }
  };

  const handleOnClickClosePedido = async () => {
    const query = await closePedidos();
    if (query === "pedido creado") {
      refetch();
    } else {
      toast.errorToast(query);
    }
  };

  const fetchPedido = async (url) => {
    const header = fetch.requestHeader("GET", null, localStorage.token);
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url, header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const addPedido = async () => {
    const header = fetch.requestHeader("POST", null, localStorage.token);
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url.crearPedidoUrl(), header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const closePedidos = async () => {
    const header = fetch.requestHeader("PUT", null, localStorage.token);
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url.closeAllPedidoUrl(), header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const searchPedido = async (url) => {
    const header = fetch.requestHeader("GET", null, localStorage.token);
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url, header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const { data: rows, refetch } = useQuery(
    [
      "pedido",
      `${getAllPedidoURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}`,
    ],
    () =>
      fetchPedido(
        `${getAllPedidoURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}`,
      ),
    {
      staleTime: 300000,
      refetchOnWindowFocus: false,
      enabled: true, // turned off by default, manual refetch is needed
    },
  );

  return (
    <MainLayout Tittle="Pedidos">
      <Container>
        <BackdropSpinner isLoading={!isFetching} />
        <NumericToolBar
          data={{
            titles: [{ text: "Total de pedidos", estado: 0 }],
            values: [rows?.total ? rows.total : `cargando...`],
          }}
        />
        <Toolbar
          isLoading={isFetching}
          resultados={resultados}
          handleOnChangeTextField={handleOnChangeTextField}
          searchField={searchField}
          nav="Agregar Pedido"
          ruta="/create-pedido"
          searchLabel="Buscar pedido"
          filename={`pedidos / ${moment().format("MMMM Do YYYY, h:mm")}`}
          pedidos={pedidos}
          type="pedidos"
        />
        <Box mt={3}>
          <DataTable
            columns={columns}
            total={rows?.total}
            page={page}
            limit={limit}
            atrib={atrib}
            order={order}
            handleChangeLimit={handleChangeLimit}
            handleChangePage={handleChangePage}
            handleChangeAtrib={handleChangeAtrib}
            handleChangeOrder={handleChangeOrder}
          >
            {rows?.results?.length ? (
              rows.results.map((row) => (
                <TableRow key={row.pedido_id}>
                  <TableCell align="center">
                    <Chip
                      color="primary"
                      label={row.pedido_id}
                      clickable
                      onClick={() => {
                        history.push(`/edit-pedido/${row.pedido_id}`);
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {moment(row.fecha).format("MMMM Do YYYY")}
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    {row.gasto_operacion
                      ? `USD $${row.gasto_operacion}`
                      : "Sin gasto definido aún"}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontWeight: "bold",
                      color: row.estatus === 1 ? "green" : "red",
                    }}
                  >
                    {row.estatus === 1 ? "Abierto" : "Cerrado"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                {rows?.results?.length === 0 ? (
                  columns.map((value) => {
                    return <TableCell key={value.tittle}></TableCell>;
                  })
                ) : (
                  <TableCell>
                    <BackdropSpinner isLoading={isFetching} />
                  </TableCell>
                )}
              </TableRow>
            )}
          </DataTable>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default memo(Pedidos);
