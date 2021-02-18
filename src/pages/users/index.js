import React, { useState, useEffect, useContext, memo } from "react";
import { Box, Container, Switch } from "@material-ui/core";
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
import NumericToolBar from "../../components/NumericToolBar/NumericToolBar";
import Chip from "@material-ui/core/Chip";

const Users = () => {
  //state
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState({});
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
    { tittle: "Usuario", atributo: "username" },
    { tittle: "Rol", atributo: "rol" },
    { tittle: "Telefono", atributo: "contact_number" },
    { tittle: "Estado", atributo: "estado" },
    { tittle: "última actividad", atributo: "last_activity" },
  ];

  //funciones

  const getAllusersURL = url.getAllUsersUrl();
  const getSearchUserURL = url.getSearchUsersUrl();
  const headerSearch = fetch.requestHeader("GET", null, localStorage.token);
  const header = fetch.requestHeader("GET", null, localStorage.token);
  const changeServiceUrl = url.getUserEstadoChangeUrl();

  const handleOnChangeTextField = (event) => {
    setSearchField(event.target.value);
    if (searchField.length >= 3) {
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

  const updateEstado = async (id, estado) => {
    const loggedInfo = await fetch.fetchData(
      `${changeServiceUrl}?estado=${!estado}&user_id=${id}`,
      header,
    );
    fetch.UnauthorizedRedirect(loggedInfo, history);
    if (loggedInfo === "changed") {
      fetchData(
        `${getAllusersURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}`,
        header,
        setRows,
      );
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
      const loggedInfo = await fetch.fetchData(url, header);
      fetch.UnauthorizedRedirect(loggedInfo, history);
      setter(loggedInfo);
      setIsLoading(false);
    };

    fetchData(
      `${getAllusersURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}`,
      header,
      setRows,
    );
  }, [user, history, page, limit, atrib, order, getAllusersURL]);

  const dashboard = [
    { text: "Total de usuarios en el sistema" },
    { text: "Administradores" },
    { text: "Usuarios Regulares" },
  ];

  return (
    <MainLayout Tittle="Usuarios">
      <BackdropSpinner isLoading={!isLoading} />
      <Container>
        {rows?.dashboard && (
          <NumericToolBar
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
          nav="Agregar Usuario"
          ruta="/create-user"
          searchLabel="Buscar usuarios"
          type="usuarios"
          filename={`usuarios / ${moment().format("MMMM Do YYYY, h:mm")}`}
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
                <TableRow key={row.user_id}>
                  <TableCell align="center">
                    <Chip
                      color="primary"
                      label={`${row.name} ${row.lastname}`}
                      clickable
                      onClick={() => {
                        history.push(`/edit-user/${row.user_id}`);
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">{row.rol}</TableCell>
                  <TableCell align="center">{row.contact_number}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={row.estado === 1 ? true : false}
                      color="primary"
                      inputProps={{
                        "aria-label": "primary checkbox",
                      }}
                      onChange={() => {
                        updateEstado(
                          row.user_id,
                          row.estado === 1 ? true : false,
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {row.last_activity
                      ? moment(row.last_activity).fromNow()
                      : ""}
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

export default memo(Users);
