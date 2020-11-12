import React from "react";
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
import ExportCSV from "../../components/ExportExcelButton/ExportExcelButton";
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

const Toolbar = ({
  className,
  isLoading,
  resultados,
  handleOnChangeTextField,
  searchField,
  nav,
  ruta,
  searchLabel,
  dataExport,
  filename,
  pedidos,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" justifyContent="flex-end">
        <ExportCSV
          csvData={dataExport}
          fileName={filename}
          loading={isLoading}
          label="Exportar a excel"
        />
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
          <BackButton texto={nav} ruta={ruta} />
        )}
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                disable={isLoading}
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
      <Box display="flex" justifyContent="flex-end"></Box>
      <Card>
        <CardContent className="search-box">
          <Box className={`${classes.searchResults}`}>
            {pedidos ? (
              <List component="nav" aria-label="results">
                {resultados.map((row) => {
                  return (
                    <>
                      <Link
                        to={`/edit-pedido/${row.pedido_id}`}
                        className={`${classes.a}`}
                        key={row.pedido_id}
                      >
                        <ListItem button>
                          <ListItemText
                            primary={`${row.pedido_id} - ${moment(
                              row.fecha,
                            ).format("MMMM Do YYYY")} - ${
                              row.estatus ? "Abierto" : "Cerrado"
                            }`}
                          />
                        </ListItem>
                      </Link>
                      <Divider light />
                    </>
                  );
                })}
              </List>
            ) : (
              <List component="nav" aria-label="results">
                {resultados.map((row) => {
                  return (
                    <>
                      <Link
                        to={`/edit-user/${row.user_id}`}
                        className={`${classes.a}`}
                        key={row.user_id}
                      >
                        <ListItem button>
                          <ListItemText
                            primary={`${row.name} ${row.lastname} ${row.address}`}
                          />
                        </ListItem>
                      </Link>
                      <Divider light />
                    </>
                  );
                })}
              </List>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
};

export default Toolbar;
