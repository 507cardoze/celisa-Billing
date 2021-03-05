import React, { useContext } from "react";
import { useQueries } from "react-query";
import { useIsFetching } from "react-query";
import { UserContext } from "../../Context/userContext";
import { useHistory } from "react-router-dom";
import * as fetch from "../../helpers/fetch";
import * as url from "../../helpers/urls";
import {
  colors,
  Grid,
  Container,
  Typography,
  CardContent,
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import DashboardGraphBar from "../DashboardGraphBar/";
import BackdropSpinner from "../../components/BackDrop/backDrop";
import LadderRanking from "../../components/LadderRanking/LadderRanking";
import { Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import ExportCSV from "../ExportExcelButton/ExportExcelButton";
import moment from "moment";
import Factura from "../Factura/Factura";

function ClientesDashboard({ desde, hasta, id_cliente }) {
  const history = useHistory();
  const [user] = useContext(UserContext);
  const isFetching = useIsFetching();
  const header = fetch.requestHeader("GET", null, localStorage.token);
  const urlClientes = url.getDataReporteClientes();
  const urlGeneral = url.getDataReporteGeneral();

  const fetchReporte = async (url, header) => {
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url, header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const results = useQueries([
    {
      queryKey: ["reporteGeneralReporte", urlGeneral, desde],
      queryFn: () =>
        fetchReporte(`${urlGeneral}?desde=${desde}&hasta=${hasta}`, header),
      staleTime: 180000,
    },
    {
      queryKey: ["reportesClientesReporte", urlClientes, desde],
      queryFn: () =>
        fetchReporte(`${urlClientes}?desde=${desde}&hasta=${hasta})}`, header),
      staleTime: 180000,
    },
  ]);

  const { data: dataGeneral } = results[0];
  const { data: dataClientes } = results[1];

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
        const info = dataClientes?.clientesConVentas.filter(
          (obj) => obj.cliente_id === parseInt(id_cliente),
        );

        const ordenesDelCliente = dataGeneral?.desglose.filter(
          (obj) => obj.id_cliente === parseInt(id_cliente),
        );

        if (info?.length) {
          return (
            <Container spacing={2} maxWidth={false}>
              <Grid item container spacing={2} xs={12} maxWidth={false}>
                <Grid container item xs={6} maxWidth={false}>
                  {/* datos del cliente */}
                  <Card item raised style={{ width: "100%" }}>
                    <CardContent
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignContent: "flex-start",
                      }}
                    >
                      <Typography color="textSecondary" gutterBottom>
                        Datos generales del cliente:
                      </Typography>
                      <Typography variant="h4" component="h2" gutterBottom>
                        {` Nombre: ${info[0].nombre}`}
                      </Typography>
                      <Typography variant="h4" component="h2" gutterBottom>
                        {`Direccion: ${info[0].direccion}`}
                      </Typography>
                      <Typography variant="h4" component="h2" gutterBottom>
                        {` Numero: ${info[0].numero}`}
                      </Typography>
                      <Typography variant="h4" component="h2" gutterBottom>
                        {` Observacion: ${info[0].observacion}`}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid container item xs={6} spacing={2}>
                  {/* resumen */}
                  <Grid item xl={6} style={{ width: "50%" }}>
                    <Card raised>
                      <CardContent
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignContent: "center",
                          height: "100%",
                        }}
                      >
                        <Typography color="textSecondary" gutterBottom>
                          Ordenes:
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom>
                          {`${info[0].numero_ventas}`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} style={{ width: "50%" }}>
                    <Card raised>
                      <CardContent
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignContent: "center",
                          height: "100%",
                        }}
                      >
                        <Typography color="textSecondary" gutterBottom>
                          Ventas Totales:
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom>
                          {`$${info[0].ventas_total.toFixed(2)}`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} style={{ width: "50%" }}>
                    <Card raised>
                      <CardContent
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignContent: "center",
                          height: "100%",
                        }}
                      >
                        <Typography color="textSecondary" gutterBottom>
                          Pagado:
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom>
                          {`$${info[0].pagado.toFixed(2)}`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} style={{ width: "50%" }}>
                    <Card raised>
                      <CardContent
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignContent: "center",
                          height: "100%",
                        }}
                      >
                        <Typography color="textSecondary" gutterBottom>
                          Saldo:
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom>
                          {`$${info[0].saldo.toFixed(2)}`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {/* lista de ordenes */}
                <Card raised style={{ marginTop: "1rem" }}>
                  <CardHeader title="Desglose de ordenes" />

                  <Divider />
                  <PerfectScrollbar>
                    <Box
                      style={{
                        overflow: "auto",
                      }}
                    >
                      <Table size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="left">Ref Orden</TableCell>
                            <TableCell align="left">Fecha</TableCell>
                            <TableCell align="left">Vendedor</TableCell>
                            <TableCell align="left">Venta</TableCell>
                            <TableCell align="left">Pagos</TableCell>
                            <TableCell align="left">Saldo</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {ordenesDelCliente?.map((obj, i) => {
                            return (
                              <TableRow hover key={i}>
                                <TableCell align="left">
                                  <Chip
                                    color="primary"
                                    label={obj.orden_id}
                                    size="small"
                                    component={Link}
                                    to={`/edit-orders/${obj.orden_id}`}
                                    clickable
                                  />
                                </TableCell>
                                <TableCell align="left">{obj.fecha}</TableCell>
                                <TableCell align="left">
                                  {obj.vendedor}
                                </TableCell>
                                <TableCell align="left">
                                  {`$${obj.ventas.toFixed(2)}`}
                                </TableCell>
                                <TableCell align="left">
                                  {`$${obj.pagos.toFixed(2)}`}
                                </TableCell>
                                <TableCell align="left">
                                  {`$${obj.saldo.toFixed(2)}`}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Box>
                  </PerfectScrollbar>
                  <Divider />
                  <Box display="flex" justifyContent="flex-end" p={2}>
                    <Factura />
                    <ExportCSV
                      label="Exportar"
                      csvData={ordenesDelCliente}
                      fileName={`reporte / ${moment().format("YYYY/MM/DD")}`}
                    />
                  </Box>
                </Card>
              </Grid>
            </Container>
          );
        } else {
          return (
            <Container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="h3"
                  style={{ marginTop: ".5rem" }}
                >
                  Este cliente no tiene datos de venta para este periodo.
                </Typography>
              </Grid>
            </Container>
          );
        }
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
