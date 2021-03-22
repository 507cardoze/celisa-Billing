import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@material-ui/core";

function EditarRevendedora({
  className,
  handleOnSubmitRevendedora,
  userData,
  selectedUsuario,
  setSelectedUsuario,
  usuarios,
  selectedAdmin,
  setSelectedAdmin,
}) {
  return (
    <form
      autoComplete="off"
      noValidate
      className={className}
      onSubmit={handleOnSubmitRevendedora}
      style={{ marginTop: "1rem" }}
    >
      <Card raised>
        <CardHeader
          subheader="Se puede asignar revendedora a un usuario en particular"
          title="Asignar Revendedora"
        />
        <Divider />
        {userData && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <FormControl>
                  <Select
                    variant="outlined"
                    fullWidth
                    value={selectedUsuario ? selectedUsuario : 0}
                    onChange={(e) =>
                      setSelectedUsuario(parseInt(e.target.value))
                    }
                    disabled={
                      process.env.NODE_ENV === "development" ? false : true
                    }
                  >
                    <MenuItem value={0}>Sin asignar</MenuItem>
                    {usuarios?.map((user) => (
                      <MenuItem key={user.user_id} value={user.user_id}>
                        {`${user.name} ${user.lastname} - ${user.username}`}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    A que usuario pertenece este cliente.
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl>
                  <Select
                    variant="outlined"
                    fullWidth
                    value={selectedAdmin ? selectedAdmin : 0}
                    onChange={(e) => setSelectedAdmin(parseInt(e.target.value))}
                  >
                    <MenuItem value={0}>Sin asignar</MenuItem>
                    {usuarios?.map((user) => (
                      <MenuItem key={user.user_id} value={user.user_id}>
                        {`${user.name} ${user.lastname}`}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    A que usuario pertenece este revendedor
                  </FormHelperText>
                </FormControl>
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
            Actualizar Datos
          </Button>
        </Box>
      </Card>
    </form>
  );
}

export default EditarRevendedora;
