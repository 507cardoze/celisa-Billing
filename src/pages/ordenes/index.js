import React, { useState, useEffect, useContext, memo } from "react";
import { Box, Container, Chip, TableRow, TableCell } from "@material-ui/core";
import Toolbar from "../../components/ToolBar/Toolbar";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import DataTable from "../../components/DataTable/databable";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../../Context/userContext";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import NumericToolBar from "../../components/NumericToolBar/NumericToolBar";

const Ordenes = () => {
  //state
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState({});
  const [resultados, setResultados] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [page, setPage] = fetch.useStickyState(1, "orders_page");
  const [limit, setLimit] = fetch.useStickyState(50, "orders_limit");
  const [atrib, setAtrib] = useState("orden_id");
  const [order, setOrder] = useState("desc");
  const [estado, setEstado] = useState(0);

  const handleChangePage = (page) => setPage(page + 1);
  const handleChangeLimit = (limit) => setLimit(limit);
  const handleChangeAtrib = (atrib) => setAtrib(atrib);
  const handleChangeOrder = (order) => setOrder(order);
  const history = useHistory();
  const [user] = useContext(UserContext);

  const { results } = rows;
  const { total } = rows;

  const columns = [
    { tittle: "Orden", atributo: "orden_id" },
    { tittle: "Pedido", atributo: "pedido_id" },
    { tittle: "Nombre vendedor", atributo: "nombre" },
    { tittle: "Nombre de factura", atributo: "nombre_cliente" },
    { tittle: "Fecha", atributo: "fecha" },
    { tittle: "Estado", atributo: "estatus" },
  ];

  //funciones
  const headerSearch = fetch.requestHeader("GET", null, localStorage.token);
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
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const fetchData = async (url, header, setter) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
      setIsLoading(false);
    };

    fetchData(
      `${getAllURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}&estado=${estado}`,
      header,
      setRows,
    );
  }, [user, history, page, limit, atrib, order, getAllURL, estado]);

  const dashboard = [
    { text: "Todas las ordenes", estado: 0 },
    { text: "Pendiente por aprobacion", estado: 1 },
    { text: "Aprobadas", estado: 2 },
    { text: "Llego al pais", estado: 3 },
    { text: "Saldo Pendiente", estado: 4 },
    { text: "Entregados", estado: 5 },
    { text: "Cancelados", estado: 6 },
  ];

  return (
    <MainLayout Tittle="Ordenes">
      <BackdropSpinner isLoading={!isLoading} />
      <Container>
        {rows?.dashboard && (
          <NumericToolBar
            setEstado={setEstado}
            ver
            data={{
              titles: dashboard,
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
          type="ordenes"
          ordenes
          filename={`ordenes / ${moment().format("MMMM Do YYYY, h:mm")}`}
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
                    {moment(row.fecha).locale("es").format("MMMM Do YYYY")}
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

export default memo(Ordenes);
