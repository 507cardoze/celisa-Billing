import React, { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import BackButton, {
  CustomButton,
} from "../../components/BackButton/BackButton";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {},
  exportButton: {
    fontWeight: "bold",
    marginRight: theme.spacing(1),
  },
  searchResults: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    maxHeight: 150,
    overflowY: "auto",
  },
  a: {
    textDecoration: "none",
    color: "black",
    fontWeight: "bold",
  },
  submit: {
    backgroundColor: theme.palette.secondary.main,
    fontWeight: "bold",
  },
}));

const getLinksContainer = (type, data, classes) => {
  switch (type) {
    case "usuarios":
      return (
        <List component="nav" aria-label="results">
          {data.map((row) => {
            return (
              <ListItem
                button
                component={Link}
                to={`/edit-user/${row.user_id}`}
                className={`${classes.a}`}
                key={row.user_id}
              >
                <ListItemText
                  primary={`nombre: ${row.name} ${row.lastname} - direccion: ${row.address}`}
                />
                <Divider light />
              </ListItem>
            );
          })}
        </List>
      );
    case "pedidos":
      return (
        <List component="nav" aria-label="results">
          {data.map((row) => {
            return (
              <ListItem
                button
                component={Link}
                to={`/edit-pedido/${row.pedido_id}`}
                className={`${classes.a}`}
                key={row.pedido_id}
              >
                <ListItemText
                  primary={`#${row.pedido_id} - ${moment(row.fecha).format(
                    "MMMM Do YYYY",
                  )} - ${row.estatus ? "Abierto" : "Cerrado"}`}
                />
                <Divider light />
              </ListItem>
            );
          })}
        </List>
      );
    case "ordenes":
      return (
        <List component="nav" aria-label="results">
          {data.map((row) => {
            return (
              <ListItem
                button
                component={Link}
                to={`/edit-orders/${row.orden_id}`}
                className={`${classes.a}`}
                key={row.orden_id}
              >
                <ListItemText
                  primary={`#${row.orden_id} - vendedor: ${row.nombre} ${row.apellido} - cliente: ${row.nombre_cliente}`}
                />
                <Divider light />
              </ListItem>
            );
          })}
        </List>
      );
    case "clientes":
      return (
        <List component="nav" aria-label="results">
          {data.map((row) => {
            return (
              <ListItem
                button
                component={Link}
                to={`/clientes/${row.cliente_id}`}
                className={`${classes.a}`}
                key={row.cliente_id}
              >
                <ListItemText
                  primary={`#${row.cliente_id} - cliente: ${row.nombre}`}
                />
                <Divider light />
              </ListItem>
            );
          })}
        </List>
      );
    default:
      return null;
  }
};

const Toolbar = ({
  className,
  isLoading,
  resultados,
  handleOnChangeTextField,
  searchField,
  nav = null,
  ruta = null,
  searchLabel,
  dataExport,
  filename,
  pedidos,
  ordenes,
  clientes,
  type,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" justifyContent="flex-end">
        {pedidos ? (
          <>
            <CustomButton text="Agregar Pedido" onClick={() => pedidos.add()} />
            <CustomButton
              style={{ marginLeft: 10, backgroundColor: "red", color: "white" }}
              text="Cerrar pedidos"
              onClick={() => pedidos.closeAll()}
            />
          </>
        ) : (
          nav && ruta && <BackButton texto={nav} ruta={ruta} />
        )}
      </Box>
      <Box mt={2}>
        <Card raised>
          <CardContent>
            <Box>
              <TextField
                style={{ width: "55%" }}
                value={searchField}
                onChange={handleOnChangeTextField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder={searchLabel}
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      {searchField.length > 0 && (
        <Card style={{ marginTop: "10px" }} raised>
          <CardContent className="search-box">
            <Box className={`${classes.searchResults}`}>
              {searchField.length > 0 &&
                getLinksContainer(type, resultados, classes)}
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
};

export default memo(Toolbar);
