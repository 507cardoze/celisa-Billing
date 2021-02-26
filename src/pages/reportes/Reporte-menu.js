import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  CardActions,
  IconButton,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";

function ReporteMenu() {
  const listData = [
    {
      title: "Por vendedores",
      description: `Este modulo tiene como finalidad dar a conocer los datos de venta
            por vendedores.`,
      type: "usuarios",
    },
    {
      title: "Por clientes",
      description: `Este modulo es para conocer los datos de los clientes en el sistema`,
      type: "clientes",
    },
    {
      title: "Por proveedores",
      description: `Este modulo es para conocer los datos de los proveedores en el sistema`,
      type: "proveedores",
    },
    {
      title: "Por ventas",
      description: `Este modulo es para conocer los datos de los ventas en el sistema`,
      type: "ventas",
    },
  ];
  return (
    <Grid container spacing={2}>
      {listData.map((card, i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={i}>
          <Card
            style={{
              minHeight: 200,
              maxHeight: 270,
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
            raised
          >
            <CardContent>
              <Typography variant="h5" component="h2">
                {card.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {card.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton
                aria-label={`Buscar-${card.type}`}
                component={Link}
                to={`/reportes/buscar/${card.type}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <SearchIcon />
                Buscar
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ReporteMenu;
