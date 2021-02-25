import React, { useState, useContext, memo } from "react";
import { Box, TableRow, TableCell, Chip } from "@material-ui/core";
import DataTable from "../../components/DataTable/databable";
import Toolbar from "../../components/ToolBar/Toolbar";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../Context/userContext";
import * as fetch from "../../helpers/fetch";
import * as url from "../../helpers/urls";
import NumericToolBar from "../../components/NumericToolBar/NumericToolBar";
import { useQuery } from "react-query";
import { useIsFetching } from "react-query";

function ClientTable() {
  const history = useHistory();
  const [user] = useContext(UserContext);
  const isFetching = useIsFetching();
  //const [rows, setRows] = useState({});
  const [resultados, setResultados] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [page, setPage] = fetch.useStickyState(1, "clients_page");
  const [limit, setLimit] = fetch.useStickyState(50, "clients_limit");
  const [atrib, setAtrib] = useState("cliente_id");
  const [order, setOrder] = useState("desc");
  const handleChangePage = (page) => setPage(page + 1);
  const handleChangeLimit = (limit) => setLimit(limit);
  const handleChangeAtrib = (atrib) => setAtrib(atrib);
  const handleChangeOrder = (order) => setOrder(order);

  // const { results } = rows;
  // const { total } = rows;

  const columns = [
    { tittle: "Cliente Ref", atributo: "cliente_id" },
    { tittle: "Nombre", atributo: "nombre" },
    { tittle: "Dirección", atributo: "direccion" },
    { tittle: "Número", atributo: "numero" },
    { tittle: "Observación", atributo: "observacion" },
  ];

  const headerSearch = fetch.requestHeader("GET", null, localStorage.token);
  const searchUrl = url.getClientSearch();

  const handleOnChangeTextField = (event) => {
    setSearchField(event.target.value);
    if (searchField.length >= 0) {
      const fetchData = async (url, header, setter) => {
        const loggedInfo = await fetch.fetchData(url, header);
        fetch.UnauthorizedRedirect(loggedInfo, history);
        setter(loggedInfo);
      };
      fetchData(
        `${searchUrl}?texto=${searchField}`,
        headerSearch,
        setResultados,
      );
    } else {
      setResultados([]);
    }
  };

  const fetchClientes = async (url) => {
    const header = fetch.requestHeader("GET", null, localStorage.token);
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url, header);
    fetch.UnauthorizedRedirect(res, history);
    return res.json();
  };

  const getClienteUrl = url.getClientes();

  const { data: rows } = useQuery(
    [
      "clientes",
      `${getClienteUrl}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}&estado=${0}`,
    ],
    () =>
      fetchClientes(
        `${getClienteUrl}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}&estado=${0}`,
      ),
    {
      staleTime: 300000,
    },
  );

  return (
    <>
      <BackdropSpinner isLoading={!isFetching} />
      <NumericToolBar
        data={{
          titles: [{ text: "Total de clientes", estado: 0 }],
          values: [rows?.total ? rows.total : `cargando...`],
        }}
      />
      <Toolbar
        isLoading={isFetching}
        resultados={resultados}
        handleOnChangeTextField={handleOnChangeTextField}
        searchField={searchField}
        nav="Agregar Cliente"
        ruta="/clientes/crear"
        searchLabel="Buscar clientes..."
        type="clientes"
        clientes
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
              <TableRow key={row.cliente_id}>
                <TableCell align="center">
                  <Chip
                    color="primary"
                    label={row.cliente_id}
                    clickable
                    onClick={() => {
                      history.push(`/clientes/editar/${row.cliente_id}`);
                    }}
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
              {columns.map((value) => (
                <TableCell key={value.tittle}></TableCell>
              ))}
            </TableRow>
          )}
        </DataTable>
      </Box>
    </>
  );
}

export default memo(ClientTable);
