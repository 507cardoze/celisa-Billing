import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import CollectionsIcon from "@material-ui/icons/Collections";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import EditIcon from "@material-ui/icons/Edit";

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
          <ListItem divider={i < products.length - 1} key={product.linea_id}>
            <ListItemAvatar>
              <CollectionsIcon alt="Product" className={classes.image} />
            </ListItemAvatar>
            <ListItemText
              primary={`${product.producto} / ${product.talla} / ${product.color}`}
              secondary={`Vendido el dia: ${product.fecha}`}
            />
            <IconButton edge="end" size="small">
              <EditIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider p={2} />
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

DashboardTableProductos.propTypes = {
  className: PropTypes.string,
};

export default DashboardTableProductos;
