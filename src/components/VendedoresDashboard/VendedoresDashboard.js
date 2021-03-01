import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useIsFetching } from "react-query";
import { UserContext } from "../../Context/userContext";
import { useHistory } from "react-router-dom";
import * as fetch from "../../helpers/fetch";
import * as url from "../../helpers/urls";
import { colors, Grid } from "@material-ui/core";
import DashboardGraphBar from "../DashboardGraphBar/";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import DashboardGraphPie from "../../components/DashboardGraphPie";

function VendedoresDashboard({ desde, hasta, id_vendedor }) {
  const history = useHistory();
  const [user] = useContext(UserContext);
  const isFetching = useIsFetching();
  const header = fetch.requestHeader("GET", null, localStorage.token);
  const urlVendedores = url.getDataReporteVendedores();
  const urlGeneral = url.getDataReporteGeneral();

  const fetchReporte = async (url, header) => {
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url, header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const { data: dataVendedores } = useQuery(
    ["reporteVendedoresReporte", urlVendedores, desde],
    () => fetchReporte(`${urlVendedores}?desde=${desde}&hasta=${hasta})}`),
    {
      staleTime: 180000,
    },
    header,
  );

  const { data: dataGeneral } = useQuery(
    ["reporteGeneralReporte", urlGeneral, desde],
    () => fetchReporte(`${urlGeneral}?desde=${desde}&hasta=${hasta}`),
    {
      staleTime: 300000,
    },
    header,
  );

  const graphSelector = (id_vendedor) => {
    switch (id_vendedor) {
      case "0":
        return (
          <DashboardGraphBar
            content={{
              datasets: [
                {
                  backgroundColor: colors.pink[600],
                  data: dataVendedores?.usuariosConVenta.map(
                    (obj) => obj.ventas_total,
                  ),
                  label: "Vendido en USD",
                },
                {
                  backgroundColor: colors.teal[500],
                  data: dataVendedores?.usuariosConVenta.map(
                    (obj) => obj.pagado,
                  ),
                  label: "Cobrado en USD",
                },
              ],
              labels: dataVendedores?.usuariosConVenta.map(
                (obj) => `${obj.name} ${obj.lastname}`,
              ),
            }}
            title="Desglose por vendedor"
            source={dataVendedores?.usuariosConVenta}
          />
        );

      default:
        const info = dataVendedores?.usuariosConVenta.filter(
          (obj) => obj.user_id === parseInt(id_vendedor),
        );
        if (info?.length) {
          return (
            <DashboardGraphPie
              title={`Desglose de ${info[0].name} ${info[0].lastname}`}
              dataSet={{
                datasets: [
                  {
                    data: [info[0].ventas_total, info[0].pagado],
                    backgroundColor: [colors.indigo[500], colors.red[600]],
                    borderWidth: 8,
                    borderColor: colors.common.white,
                    hoverBorderColor: colors.common.white,
                  },
                ],
                labels: ["Cantidad en ventas", "Cobros pendientes"],
              }}
              devices={[
                {
                  title: "Cantidad en ventas",
                  value: info[0].ventas_total.toFixed(2),
                  icon: AttachMoneyIcon,
                  color: colors.indigo[500],
                },
                {
                  title: "Cobros pendientes",
                  value: info[0].pagado.toFixed(2),
                  icon: AttachMoneyIcon,
                  color: colors.red[600],
                },
              ]}
            />
          );
        } else {
          return (
            <DashboardGraphPie
              title={`Vendedor no cuenta con informacion para esta fechas.`}
              dataSet={{
                datasets: [
                  {
                    data: [0, 100],
                    backgroundColor: [colors.indigo[500], colors.red[600]],
                    borderWidth: 8,
                    borderColor: colors.common.white,
                    hoverBorderColor: colors.common.white,
                  },
                ],
                labels: ["Cantidad en ventas", "Cobros pendientes"],
              }}
              devices={[
                {
                  title: "Ventas",
                  value: "0.00",
                  icon: AttachMoneyIcon,
                  color: colors.indigo[500],
                },
                {
                  title: "Cobros",
                  value: "0.00",
                  icon: AttachMoneyIcon,
                  color: colors.red[600],
                },
              ]}
            />
          );
        }
    }
  };

  return (
    <Grid container spacing={3}>
      <BackdropSpinner isLoading={!isFetching} />
      <Grid item xs={12}>
        {graphSelector(id_vendedor)}
      </Grid>
    </Grid>
  );
}

export default VendedoresDashboard;
