import React, { useState, useEffect, useContext, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { UserContext } from "../../Context/userContext";
import { useHistory } from "react-router-dom";
import * as fetch from "../../helpers/fetch";
import * as url from "../../helpers/urls";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import { colors } from "@material-ui/core";

import DashbordCard from "../../components/DashboardCard";
import DashboardGraphBar from "../../components/DashboardGraphBar";
import DashboardGraphPie from "../../components/DashboardGraphPie";

import DashboardTableProductos from "../../components/DashboardTableProductos";
import DashboardTableOrdenes from "../../components/DashboardTableOrdenes";

import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [user] = useContext(UserContext);
  const [dataGeneral, setDataGeneral] = useState({});
  const [dataVendedores, setDataVendedores] = useState({});
  const [dataProveedores, setDataProveedores] = useState({});

  useEffect(() => {
    fetch.UserRedirect(user, history);

    const urlGeneral = url.getDataReporteGeneral();
    const urlVendedores = url.getDataReporteVendedores();
    const urlProveedores = url.getDataReporteProveedores();

    const header = fetch.requestHeader("GET", null, localStorage.token);
    const fetchData = async (url, header, setter) => {
      setIsLoading(true);
      try {
        const loggedInfo = await fetch.fetchData(url, header);
        fetch.UnauthorizedRedirect(loggedInfo, history);
        setter(loggedInfo);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchData(
      `${urlGeneral}?desde=${`2020-1-1`}&hasta=${`2021-12-31`}`,
      header,
      setDataGeneral,
    );
    fetchData(
      `${urlVendedores}?desde=${`2020-1-1`}&hasta=${`2021-12-31`}`,
      header,
      setDataVendedores,
    );
    fetchData(
      `${urlProveedores}?desde=${`2020-1-1`}&hasta=${`2021-12-31`}`,
      header,
      setDataProveedores,
    );
  }, [user, history]);

  if (process.env.NODE_ENV === "development") {
    console.log(dataGeneral);
    console.log(dataVendedores);
    console.log(dataProveedores);
  }

  return (
    <MainLayout Tittle="Dashboard">
      <BackdropSpinner isLoading={!isLoading} />

      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={4} sm={12} md={4} xl={4} xs={12}>
            <DashbordCard
              title="Ventas realizadas"
              color={`colors.green[600]`}
              Icon={AttachMoneyIcon}
              data={`$${
                dataGeneral.ventasTotales
                  ? dataGeneral.ventasTotales.toFixed(2)
                  : `cargando ...`
              }`}
              description="Total de dinero entrante"
            />
          </Grid>
          <Grid item lg={4} sm={12} md={4} xl={4} xs={12}>
            <DashbordCard
              title="Pagos recibidos"
              color={colors.blue[600]}
              Icon={AttachMoneyIcon}
              data={`$${
                dataGeneral.pagosTotales
                  ? dataGeneral.pagosTotales.toFixed(2)
                  : `cargando ...`
              }`}
              description="Total de dinero cobrado"
            />
          </Grid>
          <Grid item lg={4} sm={12} md={4} xl={4} xs={12}>
            <DashbordCard
              title="Cobros pendientes"
              color={colors.red[600]}
              Icon={AttachMoneyIcon}
              data={`$${
                dataGeneral.saldosTotales
                  ? dataGeneral.saldosTotales.toFixed(2)
                  : `cargando ...`
              }`}
              description="Total faltante por cobrar"
            />
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default memo(Dashboard);
