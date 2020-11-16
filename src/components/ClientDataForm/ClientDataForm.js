import React, { useContext } from "react";
import { Grid, TextField } from "@material-ui/core";
import { OrderContext } from "../../Context/OrderContext";

function ClientDataForm() {
  const [orden, setOrden] = useContext(OrderContext);

  const handleChange = (event) => {
    setOrden({
      ...orden,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Grid container spacing={2} xs={12} md={12} lg={12}>
      <Grid item xs={12} md={4} lg={4}>
        <TextField
          variant="outlined"
          margin="normal"
          name="nombre_cliente"
          fullWidth
          label="Factura a nombre de"
          value={orden.nombre_cliente}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={4} lg={4}>
        <TextField
          variant="outlined"
          margin="normal"
          name="numero_cliente"
          fullWidth
          label="Teléfono"
          value={orden.numero_cliente}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={8} lg={8}>
        <TextField
          variant="outlined"
          margin="normal"
          name="direccion_cliente"
          fullWidth
          label="Dirección"
          value={orden.direccion_cliente}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
}

export default ClientDataForm;
