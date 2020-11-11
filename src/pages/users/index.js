import React, { useState, useEffect, useContext, memo } from "react";
import { Box, Container, Switch } from "@material-ui/core";
import Toolbar from "./Toolbar";
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

const Users = () => {
  //state
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState({});
  const [dataExport, setDataExport] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [atrib, setAtrib] = useState("name");
  const [order, setOrder] = useState("asc");

  const handleChangePage = (page) => setPage(page++);
  const handleChangeLimit = (limit) => setLimit(limit);
  const handleChangeAtrib = (atrib) => setAtrib(atrib);
  const handleChangeOrder = (order) => setOrder(order);
  const history = useHistory();
  const [user] = useContext(UserContext);

  const { results } = rows;
  const { total } = rows;

  const columns = [
    { tittle: "Nombres", atributo: "name" },
    { tittle: "rol", atributo: "rol" },
    { tittle: "Telefono", atributo: "contact_number" },
    { tittle: "Estado", atributo: "estado" },
    { tittle: "última actividad", atributo: "last_activity" },
  ];

  //funciones

  const handleOnChangeTextField = (event) => {
    setSearchField(event.target.value);
    if (searchField.length > 3) {
      const getSearchUserURL = url.getSearchUsersUrl();
      const headerSearch = fetch.requestHeader("GET", null, localStorage.token);
      const fetchData = async (url, header, setter) => {
        const loggedInfo = await fetch.fetchData(url, header);
        fetch.UnauthorizedRedirect(loggedInfo, history);
        setter(loggedInfo);
      };
      fetchData(
        `${getSearchUserURL}?text=${searchField}`,
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
    const getAllusersURL = url.getAllUsersUrl();
    const header = fetch.requestHeader("GET", null, localStorage.token);
    const fetchData = async (url, header, setter) => {
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
    };
    setIsLoading(true);
    fetchData(
      `${getAllusersURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}`,
      header,
      setRows,
    );
    setIsLoading(false);
  }, [user, history, page, limit, atrib, order]);

  return (
    <MainLayout Tittle="Usuarios">
      <Container maxWidth={false}>
        <Toolbar
          isLoading={isLoading}
          resultados={resultados}
          handleOnChangeTextField={handleOnChangeTextField}
          searchField={searchField}
          nav="Agregar Usuario"
          ruta="/create-user"
          searchLabel="Buscar usuarios"
          dataExport={dataExport}
          filename=""
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
            {results &&
              results.map((row) => (
                <TableRow key={row.user_id}>
                  <TableCell align="center">
                    <Link to={`/edit-user/${row.user_id}`}>
                      {`${row.name} ${row.lastname}`}
                    </Link>
                  </TableCell>
                  <TableCell align="center">{row.rol}</TableCell>
                  <TableCell align="center">{row.contact_number}</TableCell>

                  <TableCell align="center">
                    <Switch
                      checked={row.estado === 1 ? true : false}
                      color="primary"
                      inputProps={{
                        "aria-label": "primary checkbox",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {row.last_activity
                      ? moment(row.last_activity).fromNow("ss")
                      : ""}
                  </TableCell>
                </TableRow>
              ))}
          </DataTable>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default memo(Users);
