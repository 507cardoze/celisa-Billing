import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";

const useStyles = makeStyles({
  table: {
    minWidth: 1150,
    maxWidth: 1150,
  },
});

 function DataTable({children,columns, total, page, limit,handleChangeLimit,handleChangePage,atrib,order,handleChangeAtrib,handleChangeOrder}) {

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <TablePagination
    rowsPerPageOptions={[50, 100, 200]}
    labelRowsPerPage="Filas por página"
    labelDisplayedRows={({ from, to, count }) => {
      return `${from}-${to} de ${count}`
    }}
    component="div"
    count={total && total}
    rowsPerPage={limit}
    onChangeRowsPerPage={(event) =>handleChangeLimit(parseInt(event.target.value))}
    page={page - 1}
    onChangePage={(event, page) => handleChangePage(page)}
  />
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left"></TableCell>
            {columns.map((column) => {
              return (
                <TableCell align="left" key={column.tittle}>
                  <TableSortLabel
                    active={atrib === column.atributo ? true : false }
                    direction={order}
                    onClick={()=>{
                      handleChangeAtrib(column.atributo);
                      handleChangeOrder(order === "desc" ? "asc" : "desc")
                    }}
            >
              {column.tittle}
            </TableSortLabel>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
      <TablePagination
    rowsPerPageOptions={[50, 100, 200]}
    labelRowsPerPage="Filas por página"
    labelDisplayedRows={({ from, to, count }) => {
      return `${from}-${to} de ${count}`
    }}
    component="div"
    count={total && total}
    rowsPerPage={limit}
    onChangeRowsPerPage={(event) =>handleChangeLimit(parseInt(event.target.value))}
    page={page - 1}
    onChangePage={(event, page) => handleChangePage(page)}
  />
    </TableContainer>
  );
}

export default DataTable;