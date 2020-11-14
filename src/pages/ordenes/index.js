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
import { Link } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../../Context/userContext";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import * as toast from "../../helpers/toast";

const Ordenes = () => {
  //state
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState({});
  const [dataExport, setDataExport] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [atrib, setAtrib] = useState("orden_id");
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
    { tittle: "# orden", atributo: "orden_id" },
    { tittle: "# pedido", atributo: "pedido_id" },
    { tittle: "Nombre vendedor", atributo: "nombre" },
    { tittle: "Apellido vendedor", atributo: "apellido" },
    { tittle: "Nombre Cliente", atributo: "nombre_cliente" },
    { tittle: "Teléfono Cliente", atributo: "numero_cliente" },
    { tittle: "Dirección Cliente", atributo: "direccion_cliente" },
    { tittle: "Fecha", atributo: "fecha" },
    { tittle: "Estado", atributo: "estatus" },
  ];

  //funciones
  const header = fetch.requestHeader("GET", null, localStorage.token);
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
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
    };
    setIsLoading(true);
    fetchData(
      `${getAllURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}`,
      header,
      setRows,
    );
    fetchData(`${getAllURL}?excel=${true}`, header, setDataExport);
    setIsLoading(false);
  }, [user, history, page, limit, atrib, order, getAllURL]);

  return (
    <MainLayout Tittle="Ordenes">
      <Container maxWidth={false}>
        <Toolbar
          isLoading={isLoading}
          resultados={resultados}
          handleOnChangeTextField={handleOnChangeTextField}
          searchField={searchField}
          // nav="Agregar Pedido"
          // ruta="/create-pedido"
          searchLabel="Buscar ordenes"
          dataExport={dataExport}
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
                <TableRow key={row.pedido_id}>
                  <TableCell align="center">
                    <Link to={`/edit-pedido/${row.pedido_id}`}>
                      {row.pedido_id}
                    </Link>
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
                  <BackdropSpinner isLoading={isLoading} />
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