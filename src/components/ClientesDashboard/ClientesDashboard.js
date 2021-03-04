import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useIsFetching } from "react-query";
import { UserContext } from "../../Context/userContext";
import { useHistory } from "react-router-dom";
import * as fetch from "../../helpers/fetch";
import * as url from "../../helpers/urls";
import { colors, Grid, Container } from "@material-ui/core";
import DashboardGraphBar from "../DashboardGraphBar/";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import LadderRanking from "../../components/LadderRanking/LadderRanking";

function ClientesDashboard({ desde, hasta, id_cliente }) {
  const history = useHistory();
  const [user] = useContext(UserContext);
  const isFetching = useIsFetching();
  const header = fetch.requestHeader("GET", null, localStorage.token);
  const urlClientes = url.getDataReporteClientes();

  const fetchReporte = async (url, header) => {
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url, header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const { data: dataClientes } = useQuery(
    ["reportesClientesReporte", urlClientes, desde],
    () => fetchReporte(`${urlClientes}?desde=${desde}&hasta=${hasta})}`),
    {
      staleTime: 180000,
    },
    header,
  );

  const graphSelector = (id_cliente) => {
    switch (id_cliente) {
      case "0":
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={6} xl={6}>
              {/*   top 10 mejores compradores   */}
              <LadderRanking
                title="Mejores compradores"
                data={dataClientes?.clientesConVentas}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={6} xl={6}>
              {/*   top 10 deudas altas   */}
              <LadderRanking
                title="Deuda mas altas"
                data={dataClientes?.clientesConSaldosAltos}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={6} xl={6}>
              {/* bar por cliente de ventas */}
              <DashboardGraphBar
                orientation
                content={{
                  datasets: [
                    {
                      backgroundColor: colors.indigo[700],
                      data: dataClientes?.clientesConVentas.map((obj) =>
                        parseFloat(obj.ventas_total),
                      ),
                      label: "Compras",
                    },
                  ],
                  labels: dataClientes?.clientesConVentas.map(
                    (obj) => obj.nombre,
                  ),
                }}
                title="Clientes por compras"
                source={dataClientes?.clientesConVentas}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={6} xl={6}>
              {/* bar por cliente de saldos */}
              <DashboardGraphBar
                orientation
                content={{
                  datasets: [
                    {
                      backgroundColor: colors.yellow[700],
                      data: dataClientes?.clientesConSaldosAltos.map((obj) =>
                        parseFloat(obj.saldo),
                      ),
                      label: "Saldo",
                    },
                  ],
                  labels: dataClientes?.clientesConSaldosAltos.map(
                    (obj) => obj.nombre,
                  ),
                }}
                title="Clientes por deuda"
                source={dataClientes?.clientesConSaldosAltos}
              />
            </Grid>
          </Grid>
        );

      default:
      // const info = dataVendedores?.usuariosConVenta.filter(
      //   (obj) => obj.user_id === parseInt(id_vendedor),
      // );

      // const ventasRevendedoras = dataGeneral?.desglose.filter(
      //   (obj) =>
      //     obj.revendedoraRef === parseInt(id_vendedor) &&
      //     obj.id_vendedores === parseInt(id_vendedor),
      // );

      // const ventasNormales = dataGeneral?.desglose.filter(
      //   (obj) =>
      //     obj.revendedoraRef === 0 &&
      //     obj.id_vendedores === parseInt(id_vendedor),
      // );

      // if (info?.length) {
      //   return (
      //     <Grid container spacing={2}>
      //       <Grid item xs={12}>
      //         <DashboardGraphPie
      //           title={`Desglose de ${info[0].name} ${info[0].lastname}`}
      //           dataSet={{
      //             datasets: [
      //               {
      //                 data: [info[0].ventas_total, info[0].pagado],
      //                 backgroundColor: [colors.indigo[500], colors.red[600]],
      //                 borderWidth: 8,
      //                 borderColor: colors.common.white,
      //                 hoverBorderColor: colors.common.white,
      //               },
      //             ],
      //             labels: ["Cantidad en ventas", "Cobros pendientes"],
      //           }}
      //           devices={[
      //             {
      //               title: "Cantidad en ventas",
      //               value: info[0].ventas_total.toFixed(2),
      //               icon: AttachMoneyIcon,
      //               color: colors.indigo[500],
      //             },
      //             {
      //               title: "Cobros pendientes",
      //               value: info[0].pagado.toFixed(2),
      //               icon: AttachMoneyIcon,
      //               color: colors.red[600],
      //             },
      //           ]}
      //         />
      //       </Grid>
      //       <Grid item lg={6} md={12} xl={6} xs={12} container spacing={2}>
      //         <Grid item xs={6}>
      //           <DashbordCard
      //             title="Normales"
      //             color={colors.green[600]}
      //             Icon={AttachMoneyIcon}
      //             data={`$${ventasNormales
      //               ?.reduce((a, b) => {
      //                 return a + b.ventas;
      //               }, 0)
      //               .toFixed(2)}`}
      //             description="Total ventas normales"
      //           />
      //         </Grid>
      //         <Grid item xs={6}>
      //           <DashbordCard
      //             title="Pagos recibidos"
      //             color={colors.orange[600]}
      //             Icon={AttachMoneyIcon}
      //             data={`$${ventasNormales
      //               ?.reduce((a, b) => {
      //                 return a + b.saldo;
      //               }, 0)
      //               .toFixed(2)}`}
      //             description="Total de pagos recibidos producto de estas ventas"
      //           />
      //         </Grid>
      //         <Grid item xs={12}>
      //           <DashboardTableOrdenes
      //             title={`Ventas normales: `}
      //             data={
      //               ventasNormales?.length
      //                 ? ventasNormales.filter((obj) =>
      //                     obj.nombre_cliente
      //                       .toLowerCase()
      //                       .includes(searchFieldOrdenes.toLowerCase()),
      //                   )
      //                 : []
      //             }
      //             onSearchChangeOrdenes={onSearchChangeOrdenes}
      //           />
      //         </Grid>
      //       </Grid>
      //       <Grid item lg={6} md={12} xl={6} xs={12} container spacing={2}>
      //         <Grid item xs={6}>
      //           <DashbordCard
      //             title="Revendedor(as)"
      //             color={colors.indigo[600]}
      //             Icon={AttachMoneyIcon}
      //             data={`$${ventasRevendedoras
      //               ?.reduce((a, b) => {
      //                 return a + b.ventas;
      //               }, 0)
      //               .toFixed(2)}`}
      //             description="Total ventas de revendedor(as)"
      //           />
      //         </Grid>
      //         <Grid item xs={6}>
      //           <DashbordCard
      //             title="Pagos recibidos"
      //             color={colors.red[600]}
      //             Icon={AttachMoneyIcon}
      //             data={`$${ventasRevendedoras
      //               ?.reduce((a, b) => {
      //                 return a + b.saldo;
      //               }, 0)
      //               .toFixed(2)}`}
      //             description="Total del pagos recibidos producto de estas ventas"
      //           />
      //         </Grid>
      //         <Grid item xs={12}>
      //           <DashboardTableOrdenes
      //             title={`Ventas Revendedor(as): `}
      //             data={
      //               ventasRevendedoras?.length
      //                 ? ventasRevendedoras.filter((obj) =>
      //                     obj.nombre_cliente
      //                       .toLowerCase()
      //                       .includes(searchFieldOrdenes2.toLowerCase()),
      //                   )
      //                 : []
      //             }
      //             onSearchChangeOrdenes={onSearchChangeOrdenes2}
      //           />
      //         </Grid>
      //       </Grid>
      //     </Grid>
      //   );
      // } else {
      //   return (
      //     <Grid container spacing={2}>
      //       <Grid item xs={12}>
      //         <DashboardGraphPie
      //           title={`Vendedor no cuenta con informacion para esta fechas.`}
      //           dataSet={{
      //             datasets: [
      //               {
      //                 data: [0, 100],
      //                 backgroundColor: [colors.indigo[500], colors.red[600]],
      //                 borderWidth: 8,
      //                 borderColor: colors.common.white,
      //                 hoverBorderColor: colors.common.white,
      //               },
      //             ],
      //             labels: ["Cantidad en ventas", "Cobros pendientes"],
      //           }}
      //           devices={[
      //             {
      //               title: "Ventas",
      //               value: "0.00",
      //               icon: AttachMoneyIcon,
      //               color: colors.indigo[500],
      //             },
      //             {
      //               title: "Cobros",
      //               value: "0.00",
      //               icon: AttachMoneyIcon,
      //               color: colors.red[600],
      //             },
      //           ]}
      //         />
      //       </Grid>
      //     </Grid>
      //   );
      // }
    }
  };

  return (
    <Container maxWidth={false}>
      <BackdropSpinner isLoading={!isFetching} />
      {graphSelector(id_cliente)}
    </Container>
  );
}

export default ClientesDashboard;
