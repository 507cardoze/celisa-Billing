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

function ProveedoresTable() {
  const history = useHistory();
  const [user] = useContext(UserContext);
  const isFetching = useIsFetching();
  const [resultados, setResultados] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [page, setPage] = fetch.useStickyState(1, "proveedor_page");
  const [limit, setLimit] = fetch.useStickyState(50, "proveedor_limit");
  const [atrib, setAtrib] = useState("proveedor_id");
  const [order, setOrder] = useState("desc");
  const handleChangePage = (page) => setPage(page + 1);
  const handleChangeLimit = (limit) => setLimit(limit);
  const handleChangeAtrib = (atrib) => setAtrib(atrib);
  const handleChangeOrder = (order) => setOrder(order);

  const columns = [
    { tittle: "Proveedor Ref", atributo: "proveedor_id" },
    { tittle: "Nombre", atributo: "proveedor" },
  ];

  const headerSearch = fetch.requestHeader("GET", null, localStorage.token);
  const searchUrl = url.searchProveedoresUrl();

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

  const fetchData = async (url) => {
    const header = fetch.requestHeader("GET", null, localStorage.token);
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url, header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const UrlProveedores = url.getAllProveedoresUrl();

  const { data: rows } = useQuery(
    ["ProveedoresTable", UrlProveedores, page, limit, atrib, order],
    () =>
      fetchData(
        `${UrlProveedores}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}`,
      ),
    {
      staleTime: 30000,
    },
  );

  return (
    <>
      <BackdropSpinner isLoading={!isFetching} />
      <NumericToolBar
        data={{
          titles: [{ text: "Total de proveedores", estado: 0 }],
          values: [rows?.total ? rows.total : `cargando...`],
        }}
      />
      <Toolbar
        isLoading={isFetching}
        resultados={resultados}
        handleOnChangeTextField={handleOnChangeTextField}
        searchField={searchField}
        nav="Agregar proveedor"
        ruta="/proveedores/crear"
        searchLabel="Buscar proveedores..."
        type="proveedores"
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
              <TableRow key={row.proveedor_id}>
                <TableCell align="center">
                  <Chip
                    color="primary"
                    label={row.proveedor_id}
                    clickable
                    onClick={() => {
                      history.push(`/proveedores/editar/${row.proveedor_id}`);
                    }}
                  />
                </TableCell>
                <TableCell align="center">{row.proveedor}</TableCell>
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

export default memo(ProveedoresTable);
