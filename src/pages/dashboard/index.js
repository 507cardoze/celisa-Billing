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
import DashboardGraphCardProgress from "../../components/DashboardGraphCardProgress";
import DashboardTableProductos from "../../components/DashboardTableProductos";
import DashboardTableOrdenes from "../../components/DashboardTableOrdenes";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import moment from "moment";
import { useStickyState } from "../../helpers/fetch";

function Dashboard() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useContext(UserContext);
  const [dataGeneral, setDataGeneral] = useState(null);
  const [dataVendedores, setDataVendedores] = useState(null);
  const [dataProveedores, setDataProveedores] = useState(null);

  const [searchFieldProductos, setSearchFieldProductos] = useState("");
  const [searchFieldOrdenes, setSearchFieldOrdenes] = useState("");

  const [desde, setDesde] = useStickyState(
    moment().subtract(7, "days").format("YYYY-MM-DD"),
    "desde",
  );

  const handleChangeRangoFecha = (fecha) => setDesde(fecha);

  const onSearchChange = (event) => setSearchFieldProductos(event.target.value);

  const onSearchChangeOrdenes = (event) =>
    setSearchFieldOrdenes(event.target.value);

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
        console.log(error);
      }
    };

    fetchData(
      `${urlGeneral}?desde=${`${desde}`}&hasta=${`${moment().format(
        "YYYY-MM-DD",
      )}`}`,
      header,
      setDataGeneral,
    );

    fetchData(
      `${urlVendedores}?desde=${`${desde}`}&hasta=${`${moment().format(
        "YYYY-MM-DD",
      )}`}`,
      header,
      setDataVendedores,
    );
    fetchData(
      `${urlProveedores}?desde=${`${desde}`}&hasta=${`${moment().format(
        "YYYY-MM-DD",
      )}`}`,
      header,
      setDataProveedores,
    );
  }, [user, history, desde]);

  return (
    <MainLayout Tittle="Dashboard">
      <BackdropSpinner isLoading={!isLoading} />

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
            <FormControl
              style={{
                formControl: {
                  margin: "25px",
                  minWidth: 250,
                },
                selectEmpty: {
                  marginTop: "25px",
                },
              }}
              item
            >
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
          <Grid item lg={4} sm={6} md={4} xl={4} xs={12}>
            <DashbordCard
              title="Ventas realizadas"
              color={`colors.green[600]`}
              Icon={AttachMoneyIcon}
              data={`${
                dataGeneral?.ventasTotales
                  ? `$${dataGeneral.ventasTotales.toFixed(2)}`
                  : `cargando ...`
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
                  : `cargando ...`
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
                  : `cargando ...`
              }`}
              description="Total faltante por cobrar"
            />
          </Grid>
          <Grid item lg={6} sm={6} md={6} xl={6} xs={12}>
            <DashboardGraphCardProgress
              title="Se a cobrado el"
              porcentaje={Math.round(
                (dataGeneral?.pagosTotales / dataGeneral?.ventasTotales) * 100,
              )}
            />
          </Grid>
          <Grid item lg={6} sm={12} md={6} xl={6} xs={12}>
            <DashboardGraphCardProgress
              title="Porcentaje de productos sin proveedor"
              porcentaje={Math.round(
                (dataProveedores?.productosSinproveedor /
                  dataProveedores?.productosTotal) *
                  100,
              )}
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
            {dataGeneral?.pagosTotales && (
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
            )}
          </Grid>

          <Grid item lg={4} md={6} xl={3} xs={12}>
            <DashboardGraphPie
              title="Ventas por proveedor "
              dataSet={{
                datasets: [
                  {
                    data: dataProveedores?.porFecha.map((obj) => obj.productos),
                    backgroundColor: [
                      colors.indigo[500],
                      colors.orange[600],
                      colors.red[600],
                    ],
                    borderWidth: 8,
                    borderColor: colors.common.white,
                    hoverBorderColor: colors.common.white,
                  },
                ],
                labels: dataProveedores?.porFecha.map((obj) => obj.proveedor),
              }}
              devices={dataProveedores?.porFecha.map((obj) => ({
                title: obj.proveedor,
                value: obj.ventas,
                icon: AttachMoneyIcon,
                color: colors.indigo[500],
              }))}
            />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            {dataVendedores?.usuariosConVenta.length > 0 && (
              <DashboardGraphBar
                content={{
                  datasets: [
                    {
                      backgroundColor: colors.green[600],
                      data: dataVendedores?.usuariosConVenta.map(
                        (obj) => obj.ventas_total,
                      ),
                      label: "Vendido en USD",
                    },
                    {
                      backgroundColor: colors.indigo[500],
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
            )}
          </Grid>

          <Grid item lg={4} md={12} xl={3} xs={12}>
            <DashboardTableProductos
              title="Productos: "
              products={
                dataGeneral?.productosVendidos.length > 0
                  ? dataGeneral?.productosVendidos.filter((producto) => {
                      return producto.producto
                        .toLowerCase()
                        .includes(searchFieldProductos.toLowerCase());
                    })
                  : []
              }
              onSearchChange={onSearchChange}
            />
          </Grid>

          <Grid item lg={8} md={12} xl={9} xs={12}>
            <DashboardTableOrdenes
              title={`Ordenes: `}
              data={
                dataGeneral?.desglose
                  ? dataGeneral.desglose.filter((ordenes) => {
                      return ordenes.nombre_cliente
                        .toLowerCase()
                        .includes(searchFieldOrdenes.toLowerCase());
                    })
                  : []
              }
              onSearchChangeOrdenes={onSearchChangeOrdenes}
            />
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default memo(Dashboard);
