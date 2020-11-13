import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import PersonIcon from "@material-ui/icons/Person";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Divider from "@material-ui/core/Divider";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PieChartIcon from "@material-ui/icons/PieChart";
import AccountBoxIcon from "@material-ui/icons/AccountBox";

import { UserContext } from "../../Context/userContext";

function MainList() {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    links: {
      textDecoration: "none",
      cursor: "pointer",
      color: "black",
    },
  }));

  const [user] = useContext(UserContext);

  const classes = useStyles();
  return (
    <div>
      {user && user.rol === "Administrador" && (
        <>
          <Link to="/" className={classes.links}>
            <ListItem button className="list-fix-padding">
              <ListItemIcon>
                <PieChartIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>

          <Link to="/pedidos" className={classes.links}>
            <ListItem button className={`list-fix-padding`}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Pedidos" />
            </ListItem>
          </Link>

          <Link to="/orders" className={classes.links}>
            <ListItem button className={`list-fix-padding`}>
              <ListItemIcon>
                <AddShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Ordenes" />
            </ListItem>
          </Link>

          <Link to="/users" className={classes.links}>
            <ListItem button className="list-fix-padding">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Usuarios" />
            </ListItem>
          </Link>

          <Divider />
        </>
      )}

      <Link to="/create-orders" className={classes.links}>
        <ListItem button className={`list-fix-padding`}>
          <ListItemIcon>
            <ControlPointIcon />
          </ListItemIcon>
          <ListItemText primary="Crear Orden" />
        </ListItem>
      </Link>

      <Link to="/my-orders" className={classes.links}>
        <ListItem button className={`list-fix-padding`}>
          <ListItemIcon>
            <ShoppingBasketIcon />
          </ListItemIcon>
          <ListItemText primary="Mis Ordenes" />
        </ListItem>
      </Link>

      <Link to="/profile" className={classes.links}>
        <ListItem button className="list-fix-padding">
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Mi Cuenta" />
        </ListItem>
      </Link>
    </div>
  );
}

export default MainList;
