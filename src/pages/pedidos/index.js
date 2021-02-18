import React, { useState, useEffect, useContext, memo } from "react";
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

const Pedidos = () => {
  //state
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState({});
  const [dataExport, setDataExport] = useState([]);
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

  const { results } = rows;
  const { total } = rows;

  const columns = [
    { tittle: "#", atributo: "pedido_id" },
    { tittle: "Fecha", atributo: "fecha" },
    { tittle: "Gasto de Operación", atributo: "gasto_operacion" },
    { tittle: "Estado", atributo: "estatus" },
  ];

  //funciones
  const header = fetch.requestHeader("GET", null, localStorage.token);
  const headerSearch = fetch.requestHeader("GET", null, localStorage.token);
  const headerCrear = fetch.requestHeader("POST", null, localStorage.token);
  const headerClose = fetch.requestHeader("PUT", null, localStorage.token);

  const getAllPedidoURL = url.getPedidosUrl();
  const crearUrl = url.crearPedidoUrl();
  const closeAllUrl = url.closeAllPedidoUrl();
  const searchUrl = url.searchPedidosUrl();

  const pedidos = {
    add: () => handleOnClickNuevoPedido(),
    closeAll: () => handleOnClickClosePedido(),
  };

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

  const handleOnClickNuevoPedido = async () => {
    const loggedInfo = await fetch.fetchData(crearUrl, headerCrear);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "pedido creado") {
      fetchData(
        `${getAllPedidoURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}`,
        header,
        setRows,
      );
      fetchData(`${getAllPedidoURL}?excel=${true}`, header, setDataExport);
    } else {
      toast.errorToast(loggedInfo);
    }
  };

  const handleOnClickClosePedido = async () => {
    const loggedInfo = await fetch.fetchData(closeAllUrl, headerClose);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "pedido creado") {
      fetchData(
        `${getAllPedidoURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}`,
        header,
        setRows,
      );
      fetchData(`${getAllPedidoURL}?excel=${true}`, header, setDataExport);
    } else {
      toast.errorToast(loggedInfo);
    }
  };

  const fetchData = async (url, header, setter) => {
    const loggedInfo = await fetch.fetchData(url, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    setter(loggedInfo);
  };

  //efectos

  useEffect(() => {
    fetch.UserRedirect(user, history);
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const fetchData = async (url, header, setter) => {
      setIsLoading(true);
      try {
        const loggedInfo = await fetch.fetchData(url, header);
        fetch.UnauthorizedRedirect(loggedInfo, history);
        setter(loggedInfo);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(
      `${getAllPedidoURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}`,
      header,
      setRows,
    );
    fetchData(`${getAllPedidoURL}?excel=${true}`, header, setDataExport);
  }, [user, history, page, limit, atrib, order, getAllPedidoURL]);

  return (
    <MainLayout Tittle="Pedidos">
      <Container>
        <BackdropSpinner isLoading={!isLoading} />
        <NumericToolBar
          data={{
            titles: [{ text: "Total de pedidos", estado: 0 }],
            values: [total ? total : `cargando...`],
          }}
        />
        <Toolbar
          isLoading={isLoading}
          resultados={resultados}
          handleOnChangeTextField={handleOnChangeTextField}
          searchField={searchField}
          nav="Agregar Pedido"
          ruta="/create-pedido"
          searchLabel="Buscar pedido"
          dataExport={dataExport}
          filename={`pedidos / ${moment().format("MMMM Do YYYY, h:mm")}`}
          pedidos={pedidos}
          type="pedidos"
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
                {results?.length === 0 ? (
                  columns.map((value) => {
                    return <TableCell key={value.tittle}></TableCell>;
                  })
                ) : (
                  <TableCell>
                    <BackdropSpinner isLoading={isLoading} />
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
