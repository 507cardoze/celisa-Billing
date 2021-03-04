import React, { memo } from "react";
import clsx from "clsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Link } from "react-router-dom";
import ExportCSV from "../ExportExcelButton/ExportExcelButton";
import moment from "moment";

const useStyles = makeStyles(() => ({
  formControl: {
    width: "40%",
    minWidth: "300px",
    display: "flex",
    justifyContent: "center",
    padding: "25px",
  },
}));

const DashboardTableOrdenes = ({
  className,
  title,
  data,
  onSearchChangeOrdenes,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest} raised>
      <CardHeader title={`${title} ${data.length}`} />
      <FormControl className={classes.formControl}>
        <Input
          placeholder="Buscar..."
          onChange={onSearchChangeOrdenes}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </FormControl>
      <Divider />
      <PerfectScrollbar>
        <Box
          style={{ overflow: "auto", maxHeight: "500px", minHeight: "500px" }}
        >
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Ref Orden</TableCell>
                <TableCell align="left">Vendedor</TableCell>
                <TableCell align="left">Cliente</TableCell>
                <TableCell align="left">Fecha</TableCell>
                <TableCell align="left">Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((obj, i) => {
                return (
                  <TableRow hover key={i}>
                    <TableCell align="left">
                      <Chip
                        color="primary"
                        label={obj.orden_id}
                        size="small"
                        component={Link}
                        to={`/edit-orders/${obj.orden_id}`}
                        clickable
                      />
                    </TableCell>
                    <TableCell align="left">{obj.vendedor}</TableCell>
                    <TableCell align="left">{obj.nombre_cliente}</TableCell>
                    <TableCell align="left">{obj.fecha}</TableCell>
                    <TableCell align="left">
                      <Chip
                        color="primary"
                        label={obj.nombre_status}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Divider />
      <Box display="flex" justifyContent="flex-end" p={2}>
        <ExportCSV
          label="Exportar"
          csvData={data.map((orden) => {
            delete orden.pedido_id;
            delete orden.estado;
            return orden;
          })}
          fileName={`reporte de ordenes / ${moment().format("YYYY/MM/DD")}`}
        />
      </Box>
    </Card>
  );
};

DashboardTableOrdenes.propTypes = {
  className: PropTypes.string,
};

export default memo(DashboardTableOrdenes);
