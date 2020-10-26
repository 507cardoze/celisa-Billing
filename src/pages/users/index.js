import React, { useState, useEffect } from 'react';
import {Box,Container,Switch} from '@material-ui/core';
import Toolbar from './Toolbar';
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import DataTable from '../../components/DataTable/databable'
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import * as url from '../../helpers/urls';
import * as fetch from '../../helpers/fetch';
import { useHistory  } from "react-router-dom";
import { Link } from "react-router-dom";
import moment from 'moment'
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as styles from '../../helpers/styles'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));

const Users = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [atrib, setAtrib] = useState("name");
  const [order, setOrder] = useState("asc");

  const handleChangePage = (page) => setPage(page++);
  const handleChangeLimit = (limit) => setLimit(limit);
  const handleChangeAtrib = (atrib) => setAtrib(atrib);
  const handleChangeOrder = (order) => setOrder(order);
  const history = useHistory();

  const { results } = rows;
  const { total } = rows;

  const columns = [
    { tittle: "Nombres", atributo:"name" },
     { tittle: "rol",atributo:"rol" }, 
      { tittle: "última actividad",atributo: "last_activity" },
      { tittle: "Estado",atributo:"estado" }
    ];

    useEffect(()=>{
      const getAllusersURL = url.getAllUsersUrl();
      const header = fetch.requestHeader("GET",null, localStorage.token)
      const fetchData = async (url, header, setter) => {
        setIsLoading(true)
        const loggedInfo = await fetch.fetchData(url, header)
        fetch.UnauthorizedRedirect(loggedInfo, history)
        setter(loggedInfo);
        setIsLoading(false)
      }
      
      // inicio de funciones de consultas
      fetchData(`${getAllusersURL}?page=${page}&limit=${limit}&atrib=${atrib}&order=${order}`, header, setRows)
    },[history, page, limit, atrib, order])


  return (
    <MainLayout Tittle="Usuarios">
       {isLoading &&  
       <Backdrop className={classes.backdrop}  open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>}
        <Container maxWidth={false}>
        <Toolbar isLoading={isLoading} />
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
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                    >
                      <Link to={`users/edit-user/${row.user_id}`}>
                              <IconButton aria-label="edit">
                                <EditIcon />
                              </IconButton>
                            </Link>
                    </TableCell>
                    <TableCell align="left">{`${row.name} ${row.lastname}`}</TableCell>
                    <TableCell align="left">{row.rol}</TableCell>
                    <TableCell align="left">{moment(row.last_activity).fromNow()}</TableCell>
                    <TableCell align="left">
                      <Switch
                        checked={row.estado === 1 ? true : false}
                        //color="primary"
                        // inputProps={{
                        //   "aria-label": "primary checkbox",
                        // }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </DataTable>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Users;