import React, { useState, useContext } from "react";
import {
  Grid,
  colors,
  Switch,
  FormGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { UserContext } from "../../Context/userContext";
import { useHistory } from "react-router-dom";
import * as fetch from "../../helpers/fetch";
import * as url from "../../helpers/urls";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import DashbordCard from "../../components/DashboardCard";
import DashboardGraphBar from "../../components/DashboardGraphBar";
import DashboardGraphPie from "../../components/DashboardGraphPie";
import DashboardGraphCardProgress from "../../components/DashboardGraphCardProgress";
import DashboardTableProductos from "../../components/DashboardTableProductos";
import DashboardTableOrdenes from "../../components/DashboardTableOrdenes";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import MoneyOffIcon from "@material-ui/icons/MoneyOff";
import { useQuery } from "react-query";
import { useIsFetching } from "react-query";

function DashboardGeneralVentas({
  desde,
  hasta,
  ventas,
  proveedores,
  vendedores,
  desglose,
  modulos,
}) {
  const history = useHistory();
  const [user] = useContext(UserContext);
  const isFetching = useIsFetching();

  const [searchFieldProductos, setSearchFieldProductos] = useState("");
  const [searchFieldOrdenes, setSearchFieldOrdenes] = useState("");

  const [ventasState, setVentasState] = useState(ventas);
  const [proveedoresState, setProveedoresState] = useState(proveedores);
  const [vendedoresState, setVendedoresState] = useState(vendedores);
  const [desgloseState, setDesgloseState] = useState(desglose);

  const onSearchChange = (event) => setSearchFieldProductos(event.target.value);

  const onSearchChangeOrdenes = (event) =>
    setSearchFieldOrdenes(event.target.value);

  const header = fetch.requestHeader("GET", null, localStorage.token);
  const urlGeneral = url.getDataReporteGeneral();
  const urlVendedores = url.getDataReporteVendedores();
  const urlProveedores = url.getDataReporteProveedores();

  const fetchReporte = async (url, header) => {
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url, header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const { data: dataGeneral } = useQuery(
    ["reporteGeneral", urlGeneral, desde],
    () => fetchReporte(`${urlGeneral}?desde=${desde}&hasta=${hasta}`),
    {
      staleTime: 300000,
    },
    header,
  );

  const { data: dataVendedores } = useQuery(
    ["reporteVendedores", urlVendedores, desde],
    () => fetchReporte(`${urlVendedores}?desde=${desde}&hasta=${hasta})}`),
    {
      staleTime: 300000,
    },
    header,
  );

  const { data: dataProveedores } = useQuery(
    ["reporteProveedores", urlProveedores, desde],
    () => fetchReporte(`${urlProveedores}?desde=${desde}&hasta=${hasta}`),
    {
      staleTime: 300000,
    },
    header,
  );
  return (
    <Grid container spacing={3}>
      <BackdropSpinner isLoading={!isFetching} />
      {modulos ? (
        <Grid item xs={12} container justify="flex-end" alignItems="center">
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={ventasState}
                    onChange={() => setVentasState(!ventasState)}
                  />
                }
                label="Ventas"
                labelPlacement="top"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={proveedoresState}
                    onChange={() => setProveedoresState(!proveedoresState)}
                  />
                }
                label="Proveedores"
                labelPlacement="top"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={vendedoresState}
                    onChange={() => setVendedoresState(!vendedoresState)}
                  />
                }
                label="Vendedores"
                labelPlacement="top"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={desgloseState}
                    onChange={() => setDesgloseState(!desgloseState)}
                  />
                }
                label="Desglose"
                labelPlacement="top"
              />
            </FormGroup>
          </FormControl>
        </Grid>
      ) : null}

      {ventasState ? (
        <>
          <Grid item lg={4} sm={6} md={4} xl={4} xs={12}>
            <DashbordCard
              title="Ventas realizadas"
              color={`colors.green[600]`}
              Icon={AttachMoneyIcon}
              data={`${
                dataGeneral?.ventasTotales
                  ? `$${dataGeneral.ventasTotales.toFixed(2)}`
                  : `$${0.0}`
              }`}
              description="Total de dinero entrante"
            />
          </Grid>
          <Grid item lg={4} sm={6} md={4} xl={4} xs={12}>
            <DashbordCard
              title="Pagos recibidos"
              color={colors.blue[600]}
              Icon={AttachMoneyIcon}
              data={`${
                dataGeneral?.pagosTotales
                  ? `$${dataGeneral.pagosTotales.toFixed(2)}`
                  : `$${0.0}`
              }`}
              description="Total de dinero cobrado"
            />
          </Grid>
          <Grid item lg={4} sm={6} md={4} xl={4} xs={12}>
            <DashbordCard
              title="Cobros pendientes"
              color={colors.red[600]}
              Icon={AttachMoneyIcon}
              data={`${
                dataGeneral?.saldosTotales
                  ? `$${dataGeneral.saldosTotales.toFixed(2)}`
                  : `$${0.0}`
              }`}
              description="Total faltante por cobrar"
            />
          </Grid>
          <Grid item lg={6} sm={6} md={6} xl={6} xs={12}>
            <DashboardGraphCardProgress
              title="Se a cobrado el"
              Icon={MoneyOffIcon}
              color={colors.deepPurple[600]}
              porcentaje={Math.round(
                (dataGeneral?.pagosTotales / dataGeneral?.ventasTotales) * 100,
              )}
            />
          </Grid>
          <Grid item lg={6} sm={6} md={6} xl={6} xs={12}>
            <DashboardGraphCardProgress
              title="Productos sin proveedor"
              color={colors.teal[600]}
              Icon={AddShoppingCartIcon}
              onClick={() => history.push("/clientes")}
              porcentaje={
                dataProveedores?.porFecha.length
                  ? Math.round(
                      (dataProveedores?.productosSinproveedor /
                        dataProveedores?.productosTotal) *
                        100,
                    )
                  : 0
              }
            />
          </Grid>

          <Grid item lg={8} md={12} xl={9} xs={12}>
            {dataGeneral?.por_fecha.length > 0 && (
              <DashboardGraphBar
                content={{
                  datasets: [
                    {
                      backgroundColor: colors.indigo[700],
                      data: dataGeneral.por_fecha.map((obj) =>
                        parseFloat(obj.ventas),
                      ),
                      label: "Vendido en USD",
                    },
                    {
                      backgroundColor: colors.orange[600],
                      data: dataGeneral.por_fecha.map((obj) =>
                        parseFloat(obj.pagado),
                      ),
                      label: "Cobrado en USD",
                    },
                  ],
                  labels: dataGeneral.por_fecha.map((obj) => obj.fecha),
                }}
                title="Desglose por fecha"
                source={dataGeneral.por_fecha}
              />
            )}
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            {dataGeneral?.pagosTotales ? (
              <DashboardGraphPie
                title="Porcentajes de venta"
                dataSet={{
                  datasets: [
                    {
                      data: [
                        dataGeneral?.pagosTotales
                          ? dataGeneral.pagosTotales
                          : 0,
                        dataGeneral?.saldosTotales
                          ? dataGeneral.saldosTotales
                          : 0,
                      ],
                      backgroundColor: [colors.indigo[500], colors.red[600]],
                      borderWidth: 8,
                      borderColor: colors.common.white,
                      hoverBorderColor: colors.common.white,
                    },
                  ],
                  labels: ["Pagos recibidos", "Cobros pendientes"],
                }}
                devices={[
                  {
                    title: "Pagos recibidos",
                    value: dataGeneral?.pagosTotales?.toFixed(2),
                    icon: AttachMoneyIcon,
                    color: colors.indigo[500],
                  },
                  {
                    title: "Cobros pendientes",
                    value: dataGeneral?.saldosTotales?.toFixed(2),
                    icon: AttachMoneyIcon,
                    color: colors.red[600],
                  },
                ]}
              />
            ) : null}
          </Grid>
        </>
      ) : null}

      <Grid
        item
        lg={!vendedores ? 12 : 6}
        md={!vendedores ? 12 : 6}
        xl={!vendedores ? 12 : 6}
        xs={12}
      >
        {proveedoresState && dataVendedores?.usuariosConVenta.length ? (
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
            title="Desglose por Proveedor"
            source={dataProveedores?.porFecha}
          />
        ) : null}
      </Grid>
      <Grid
        item
        lg={!proveedores ? 12 : 6}
        md={!proveedores ? 12 : 6}
        xl={!proveedores ? 12 : 6}
        xs={12}
      >
        {vendedoresState && dataVendedores?.usuariosConVenta.length ? (
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
            source={dataVendedores.usuariosConVenta}
          />
        ) : null}
      </Grid>

      <Grid item lg={4} md={12} xl={3} xs={12}>
        {desgloseState && dataGeneral?.productosVendidos.length ? (
          <DashboardTableProductos
            title="Productos: "
            products={dataGeneral.productosVendidos.filter((producto) =>
              producto.producto
                .toLowerCase()
                .includes(searchFieldProductos.toLowerCase()),
            )}
            onSearchChange={onSearchChange}
          />
        ) : null}
      </Grid>

      <Grid item lg={8} md={12} xl={9} xs={12}>
        {desgloseState && dataGeneral?.desglose.length ? (
          <DashboardTableOrdenes
            title={`Ordenes: `}
            data={dataGeneral.desglose.filter((ordenes) =>
              ordenes.nombre_cliente
                .toLowerCase()
                .includes(searchFieldOrdenes.toLowerCase()),
            )}
            onSearchChangeOrdenes={onSearchChangeOrdenes}
          />
        ) : null}
      </Grid>
    </Grid>
  );
}

export default DashboardGeneralVentas;
