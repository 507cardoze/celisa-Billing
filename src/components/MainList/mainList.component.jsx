import React, { useContext, memo } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  makeStyles,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { colors } from "@material-ui/core";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import PersonIcon from "@material-ui/icons/Person";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PieChartIcon from "@material-ui/icons/PieChart";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import SearchIcon from "@material-ui/icons/Search";
import { UserContext } from "../../Context/userContext";
import ApartmentIcon from "@material-ui/icons/Apartment";

function MainList() {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(2),
    },
    links: {
      textDecoration: "none",
      cursor: "pointer",
      color: colors.blueGrey[900],
    },
  }));

  const [user] = useContext(UserContext);
  const classes = useStyles();

  const privateLinks = [
    { route: "/", Icon: PieChartIcon, text: "Dashboard" },
    { route: "/proveedores", Icon: ApartmentIcon, text: "Proveedores" },
    { route: "/pedidos", Icon: AssignmentIcon, text: "Pedidos" },
    { route: "/clientes", Icon: EmojiPeopleIcon, text: "clientes" },
    { route: "/orders", Icon: AddShoppingCartIcon, text: "Ordenes" },
    { route: "/users", Icon: PersonIcon, text: "Usuarios" },
    { route: "/reportes", Icon: SearchIcon, text: "Reportes" },
  ];

  const publicLinks = [
    { route: "/create-orders", Icon: ControlPointIcon, text: "Crear Ordenes" },
    { route: "/my-orders", Icon: ShoppingBasketIcon, text: "Mis Ordenes" },
    { route: "/profile", Icon: AccountBoxIcon, text: "Mi Cuenta" },
  ];

  return (
    <div>
      {user?.rol === "Administrador" &&
        privateLinks.map((link, index) => (
          <NavLink key={index} exact to={link.route} className={classes.links}>
            <ListItem button className="list-fix-padding">
              <ListItemIcon>
                <link.Icon />
              </ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItem>
          </NavLink>
        ))}
      {user?.rol === "Administrador" && <Divider />}
      {publicLinks.map((link, index) => (
        <NavLink key={index} exact to={link.route} className={classes.links}>
          <ListItem button className="list-fix-padding">
            <ListItemIcon>
              <link.Icon />
            </ListItemIcon>
            <ListItemText primary={link.text} />
          </ListItem>
        </NavLink>
      ))}
    </div>
  );
}

export default memo(MainList);
