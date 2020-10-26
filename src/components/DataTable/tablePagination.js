import React from "react";
import TablePagination from "@material-ui/core/TablePagination";

function PaginationTabWrapper(props,page,limit,total, handleChangeLimit,handleChangePage) {
  return (
    <TablePagination
    rowsPerPageOptions={[50, 100, 200]}
    labelRowsPerPage="Filas por página"
    component="div"
    count={total && total}
    rowsPerPage={limit}
    onChangeRowsPerPage={(event) =>handleChangeLimit(parseInt(event.target.value))}
    page={page - 1}
    onChangePage={(event, page) => handleChangePage(page)}
  >
  {props.children}
  </TablePagination>
  );
}

export default PaginationTabWrapper;