import React, { memo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import CollectionsIcon from "@material-ui/icons/Collections";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import {
  Box,
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import ExportCSV from "../ExportExcelButton/ExportExcelButton";
import moment from "moment";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  image: {
    height: 48,
    width: 48,
  },
  list: {
    overflow: "auto",
    maxHeight: "500px",
  },
  formControl: {
    width: "75%",
    minWidth: "300px",
    display: "flex",
    justifyContent: "center",
    padding: "25px",
  },
});

const DashboardTableProductos = ({
  className,
  title,
  products,
  onSearchChange,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title={`${title} ${products.length}`} />
      <FormControl className={classes.formControl}>
        <Input
          placeholder="Buscar..."
          onChange={onSearchChange}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </FormControl>
      <Divider />
      <List className={classes.list}>
        {products.map((product, i) => (
          <ListItem
            divider={i < products.length - 1}
            key={product.linea_id}
            style={{
              maxHeight: "80px",
              textDecoration: "none",
              color: "#646e7a",
            }}
            component={Link}
            to={`./edit-orders/${product.orden_id}`}
          >
            <ListItemAvatar>
              <CollectionsIcon alt="Product" className={classes.image} />
            </ListItemAvatar>
            <ListItemText
              primary={`${product.producto} / ${product.talla} / ${product.color}`}
              secondary={`Vendido el dia: ${product.fecha}`}
              style={{ color: "black" }}
            />
          </ListItem>
        ))}
      </List>
      <Divider p={2} />
      <Box display="flex" justifyContent="flex-end" p={2}>
        <ExportCSV
          label="Exportar"
          csvData={products.map((producto) => {
            delete producto.linea_id;
            return producto;
          })}
          fileName={`reporte de productos / ${moment().format("YYYY/MM/DD")}`}
        />
      </Box>
    </Card>
  );
};

DashboardTableProductos.propTypes = {
  className: PropTypes.string,
};

export default memo(DashboardTableProductos);
