import React from "react";
import clsx from "clsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import {
  Box,
  Button,
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
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles(() => ({
  overflow: {
    overflow: "auto",
  },
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
    <Card className={clsx(classes.root, className)} {...rest}>
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
        <Box minWidth={700} maxHeight={500} className={classes.overflow}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ref Orden</TableCell>
                <TableCell>Vendedor</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.overflow}>
              {data.map((obj, i) => {
                return (
                  <TableRow
                    hover
                    key={obj.orden_id}
                    divider={i < data.length - 1}
                  >
                    <TableCell>
                      <Chip color="primary" label={obj.orden_id} size="small" />
                    </TableCell>
                    <TableCell>{obj.vendedor}</TableCell>
                    <TableCell>{obj.nombre_cliente}</TableCell>
                    <TableCell>{obj.fecha}</TableCell>
                    <TableCell>
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
        <Button
          color="default"
          endIcon={<ArrowDownwardIcon />}
          size="small"
          variant="text"
        >
          Exportar
        </Button>
      </Box>
    </Card>
  );
};

DashboardTableOrdenes.propTypes = {
  className: PropTypes.string,
};

export default DashboardTableOrdenes;
