import React from "react";
import { Container, Grid, Paper } from "@material-ui/core";

function SeleccionPedidos() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper>
            <h3>Select aqui!</h3>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <h3>Boton de siguiente aqui!</h3>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SeleccionPedidos;
