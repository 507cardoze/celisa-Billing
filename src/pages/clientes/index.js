import React, { useState, useEffect, useContext, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import { UserContext } from "../../Context/userContext";
import { useHistory } from "react-router-dom";
import * as fetch from "../../helpers/fetch";
import * as url from "../../helpers/urls";
import { Box, Container, TableRow, TableCell, Chip } from "@material-ui/core";
import DataTable from "../../components/DataTable/databable";
import Toolbar from "../../components/ToolBar/Toolbar";

function Clientes() {
  const history = useHistory();
  const [user] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState({});
  const [resultados, setResultados] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [page, setPage] = fetch.useStickyState(1, "clients_page");
  const [limit, setLimit] = fetch.useStickyState(50, "clients_limit");
  const [atrib, setAtrib] = useState("cliente_id");
  const [order, setOrder] = useState("desc");
  const [estado, setEstado] = useState(0);
  const handleChangePage = (page) => setPage(page + 1);
  const handleChangeLimit = (limit) => setLimit(limit);
  const handleChangeAtrib = (atrib) => setAtrib(atrib);
  const handleChangeOrder = (order) => setOrder(order);

  const { results } = rows;
  const { total } = rows;

  const columns = [
    { tittle: "Cliente Ref", atributo: "cliente_id" },
    { tittle: "Nombre", atributo: "nombre" },
    { tittle: "Dirección", atributo: "direccion" },
    { tittle: "Número", atributo: "numero" },
    { tittle: "Observación", atributo: "observacion" },
  ];

  useEffect(() => {
    fetch.UserRedirect(user, history);
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const getClienteUrl = url.getClientes();
    const fetchData = async (url, header, setter) => {
      setIsLoading(true);
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
      setIsLoading(false);
    };

    fetchData(
      `${getClienteUrl}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}&estado=${estado}`,
      header,
      setRows,
    );
  }, [user, history, page, limit, atrib, order, estado]);

  console.log(rows);

  return (
    <MainLayout Tittle="Clientes">
      <BackdropSpinner isLoading={!isLoading} />
      <Container maxWidth={false}>
        {/* <Toolbar
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
        /> */}
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
                <TableRow key={row.cliente_id}>
                  <TableCell align="center">
                    <Chip
                      color="primary"
                      label={row.cliente_id}
                      clickable
                      //   onClick={() => {
                      //     history.push(`/edit-orders/${row.orden_id}`);
                      //   }}
                    />
                  </TableCell>
                  <TableCell align="center">{row.nombre}</TableCell>
                  <TableCell align="center">{row.direccion}</TableCell>
                  <TableCell align="center">{row.numero}</TableCell>
                  <TableCell align="center">{row.observacion}</TableCell>
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
}

export default memo(Clientes);
