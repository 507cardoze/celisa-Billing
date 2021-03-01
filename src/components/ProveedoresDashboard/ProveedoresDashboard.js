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
import DashbordCard from "../../components/DashboardCard";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

function ProveedoresDashboard({ desde, hasta, id_proveedor }) {
  const history = useHistory();
  const [user] = useContext(UserContext);
  const isFetching = useIsFetching();
  const header = fetch.requestHeader("GET", null, localStorage.token);
  const urlProveedores = url.getDataReporteProveedores();

  const fetchReporte = async (url, header) => {
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url, header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const { data: dataProveedores } = useQuery(
    ["reporteProveedoresBusqueda", urlProveedores, desde],
    () => fetchReporte(`${urlProveedores}?desde=${desde}&hasta=${hasta}`),
    {
      staleTime: 180000,
    },
    header,
  );

  const graphSelector = (id_proveedor) => {
    switch (id_proveedor) {
      case "0":
        return (
          <DashboardGraphBar
            content={{
              datasets: [
                {
                  backgroundColor: colors.green[600],
                  data: dataProveedores?.porFecha.map((obj) => obj.ventas),
                  label: "Vendido en USD",
                },
                {
                  backgroundColor: colors.orange[600],
                  data: dataProveedores?.porFecha.map((obj) => obj.productos),
                  label: "Cantidad de productos",
                },
              ],
              labels: dataProveedores?.porFecha.map((obj) => obj.proveedor),
            }}
            title="Ventas divididas por proveedor"
            source={dataProveedores?.porFecha}
          />
        );

      default:
        const info = dataProveedores?.porFecha.filter(
          (obj) => obj.proveedor_id === parseInt(id_proveedor),
        );
        return (
          <h3>
            {info?.length ? (
              <DashbordCard
                title={`${info[0].proveedor}`}
                color={`colors.green[600]`}
                Icon={AttachMoneyIcon}
                data={`$${info[0].ventas.toFixed(2)}`}
                description={`Se vendieron ${info[0].productos} productos`}
              />
            ) : (
              <DashbordCard
                title={`Proveedor no cuenta con informacion para esta fechas.`}
                color={`colors.green[600]`}
                Icon={AttachMoneyIcon}
                data={`$0`}
                description={`No hay productos registrados.`}
              />
            )}
          </h3>
        );
    }
  };

  return (
    <Grid container spacing={3}>
      <BackdropSpinner isLoading={!isFetching} />
      <Grid item xs={12}>
        {graphSelector(id_proveedor)}
      </Grid>
    </Grid>
  );
}

export default ProveedoresDashboard;
