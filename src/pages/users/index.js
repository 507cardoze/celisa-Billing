import React, { useState } from 'react';
import {Box,Container,Switch} from '@material-ui/core';
import Toolbar from './Toolbar';
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import DataTable from '../../components/DataTable/databable'
import PaginationTabWrapper from "../../components/DataTable/tablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";


const Users = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [atrib, setAtrib] = useState("");
  const [order, setOrder] = useState("DESC");
  const handleChangePage = (page) => setPage(page + 1);
  const handleChangeLimit = (limit) => setLimit(limit);

  const { results } = rows;
  const { total } = rows;

  const columns = [
    { tittle: "Nombres", atributo:"name" },
    { tittle: "Numero",atributo:"contact_number" },
     { tittle: "rol",atributo:"rol" }, 
     { tittle: "Inició Sesión",atributo: "login_time" },
      { tittle: "última actividad",atributo: "last_activity" },
      { tittle: "Estado",atributo:"estado" }
    ];


    

  return (
    <MainLayout Tittle="Usuarios">
        <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
        <PaginationTabWrapper page={page} limit={limit} handleChangePage={handleChangePage} handleChangeLimit={handleChangeLimit} />
            <DataTable columns={columns}>
              {/* {results &&
                results.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                    ></TableCell>
                    <TableCell align="left">{row.proceso}</TableCell>
                    <TableCell align="left">
                      <Switch
                        checked={row.estado === 1 ? true : false}
                        color="primary"
                        className="inputs"
                        inputProps={{
                          "aria-label": "primary checkbox",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))} */}
            </DataTable>
            <PaginationTabWrapper/>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Users;