import React, { useContext, useEffect, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import {
  Grid,
  Container,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";
import moment from "moment";
import { useStickyState } from "../../helpers/fetch";
import DashboardGeneralVentas from "../../components/DashboardGeneralVentas/DashboardGeneralVentas";
import { UserContext } from "../../Context/userContext";

function Dashboard({ history }) {
  const [desde, setDesde] = useStickyState(
    moment().subtract(7, "days").format("YYYY-MM-DD"),
    "desde",
  );
  const [user] = useContext(UserContext);
  const hoy = moment().format("YYYY-MM-DD");
  const handleChangeRangoFecha = (fecha) => setDesde(fecha);

  useEffect(() => {
    if (user?.rol === "Usuario Final") return history.push("/create-orders");
  }, [user, history]);

  return (
    <MainLayout Tittle="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            container
          >
            <FormControl item>
              <InputLabel>{`Desde ${desde} hasta hoy, ${moment().format(
                "YYYY-MM-DD",
              )}`}</InputLabel>
              <Select
                value={desde}
                onChange={(e) => handleChangeRangoFecha(e.target.value)}
                inputProps={{
                  name: "fecha",
                }}
              >
                <MenuItem value={desde}>
                  <em>Seleccione una rango de fecha</em>
                </MenuItem>
                <MenuItem
                  value={moment().subtract(7, "days").format("YYYY-MM-DD")}
                >
                  Últimos 7 dias
                </MenuItem>
                <MenuItem
                  value={moment().subtract(15, "days").format("YYYY-MM-DD")}
                >
                  Última 2 Semana
                </MenuItem>
                <MenuItem
                  value={moment().subtract(1, "months").format("YYYY-MM-DD")}
                >
                  Último Mes
                </MenuItem>
                <MenuItem
                  value={moment().subtract(6, "months").format("YYYY-MM-DD")}
                >
                  Últimos 6 Mes
                </MenuItem>
                <MenuItem
                  value={moment().subtract(2, "years").format("YYYY-MM-DD")}
                >
                  Últimos 2 años
                </MenuItem>
              </Select>
              <FormHelperText>
                Al hacer cambios aqui, se afecta la información mostrada.
              </FormHelperText>
            </FormControl>
          </Grid>
          <DashboardGeneralVentas
            desde={desde}
            hasta={hoy}
            ventas
            proveedores
            vendedores
            desglose
            clientes
          />
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default memo(Dashboard);
