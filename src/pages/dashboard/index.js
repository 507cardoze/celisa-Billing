import React, { useContext, useEffect, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import { Grid, Container } from "@material-ui/core";
import moment from "moment";
import { useStickyState } from "../../helpers/fetch";
import DashboardGeneralVentas from "../../components/DashboardGeneralVentas/DashboardGeneralVentas";
import { UserContext } from "../../Context/userContext";
import DateSelector from "./DateSelector";

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
            <DateSelector
              handleChangeRangoFecha={handleChangeRangoFecha}
              desde={desde}
            />
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
