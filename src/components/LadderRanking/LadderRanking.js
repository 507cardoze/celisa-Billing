import React, { useState } from "react";
import {
  makeStyles,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  TextField,
  InputAdornment,
  ListSubheader,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    minHeight: 200,
    maxHeight: 500,
    overflow: "auto",
  },
}));

function LadderRanking({ title, data }) {
  const classes = useStyles();
  const [searchField, setSearchField] = useState("");
  return (
    <List
      subheader={
        <ListSubheader style={{ fontSize: "2.3rem" }}>{title}</ListSubheader>
      }
      className={classes.root}
    >
      <TextField
        value={searchField}
        label="Filtrar..."
        style={{ margin: "1rem", width: 300 }}
        onChange={(e) => setSearchField(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
      />
      {data
        ?.filter((cliente) =>
          cliente.nombre.toLowerCase().includes(searchField.toLowerCase()),
        )
        .map((item) => {
          return (
            <>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={item.nombre} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.nombre}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {`Total ordenes: ${item.numero_ventas} `}
                      </Typography>
                      <br></br>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {`Total en compra: $${item.ventas_total.toFixed(2)} `}
                      </Typography>
                      <br></br>

                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {`Total de pagos: $${item.pagado.toFixed(2)} `}
                      </Typography>
                      <br></br>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {`Total en saldo: $${item.saldo.toFixed(2)} `}
                      </Typography>
                      <br></br>
                      {item.direccion}
                      <br></br>
                      {item.numero}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </>
          );
        })}
    </List>
  );
}

export default LadderRanking;
