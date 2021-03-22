import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@material-ui/core";

function NewClientForm({
  handleOnSubmit,
  handleChange,
  userData,
  className,
  paises,
}) {
  return (
    <form
      autoComplete="off"
      noValidate
      className={className}
      onSubmit={handleOnSubmit}
    >
      <Card>
        <CardHeader
          subheader="Ingrese la información del cliente"
          title="Crear Cliente"
        />
        <Divider />
        {userData && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Por favor especifique el nombre"
                  label="Nombre completo"
                  name="nombre"
                  onChange={handleChange}
                  required
                  value={userData.nombre}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  name="direccion"
                  onChange={handleChange}
                  required
                  value={userData.direccion}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Número de teléfono"
                  name="numero"
                  onChange={handleChange}
                  type="text"
                  value={userData.numero}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl item>
                  <Select
                    variant="outlined"
                    fullWidth
                    value={userData.id_pais}
                    onChange={handleChange}
                    inputProps={{
                      name: "id_pais",
                    }}
                  >
                    {paises?.map((pais) => (
                      <MenuItem key={pais.pais_id} value={pais.pais_id}>
                        {pais.pais}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Seleccione un pais.</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={10} xs={12}>
                <TextField
                  fullWidth
                  label="Observación"
                  name="observacion"
                  onChange={handleChange}
                  type="text"
                  value={userData.observacion}
                  variant="outlined"
                  multiline={3}
                />
              </Grid>
            </Grid>
          </CardContent>
        )}
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2} alignItems="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ margin: "5px" }}
          >
            Guardar Detalles
          </Button>
        </Box>
      </Card>
    </form>
  );
}

export default NewClientForm;
