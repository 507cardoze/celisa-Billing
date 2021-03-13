import React, { useRef, useContext } from "react";
import Pdf from "react-to-pdf";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { useQueries } from "react-query";
import { useIsFetching } from "react-query";
import { UserContext } from "../../Context/userContext";
import { useHistory } from "react-router-dom";
import * as fetch from "../../helpers/fetch";
import * as url from "../../helpers/urls";
import {
  Grid,
  Container,
  Typography,
  CardContent,
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
import Logo from "../../static/Celisastore logotipo.png";
import PerfectScrollbar from "react-perfect-scrollbar";
import BackdropSpinner from "../../components/BackDrop/backDrop";

function Factura({ match }) {
  const { desde, hasta, id_cliente } = match.params;
  const ref = useRef(null);
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

  const info = dataClientes?.clientesConVentas.filter(
    (obj) => obj.cliente_id === parseInt(id_cliente),
  );

  const ordenesDelCliente = dataGeneral?.desglose.filter(
    (obj) => obj.id_cliente === parseInt(id_cliente),
  );

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        style={{ fontWeight: "bold", marginRight: ".5rem" }}
        onClick={() =>
          history.push(
            `/reportes/preview/${desde}/${hasta}/clientes/${id_cliente}`,
          )
        }
      >
        Volver
      </Button>
      <Pdf
        targetRef={ref}
        filename={`estado-de-cuenta-${moment().format("YYYY-MM-DD")}.pdf`}
        x={-1}
        y={10}
        scale={0.65}
      >
        {({ toPdf }) => (
          <Button
            variant="contained"
            color="default"
            style={{ fontWeight: "bold" }}
            onClick={toPdf}
          >
            Descargar en PDF
          </Button>
        )}
      </Pdf>
      {info?.length && ordenesDelCliente?.length ? (
        <Container
          maxWidth={false}
          ref={ref}
          component={Paper}
          elevation={3}
          square
          style={{ paddingBottom: "2rem", minWidth: "1100px" }}
        >
          <Grid
            item
            container
            spacing={2}
            xs={12}
            maxWidth={false}
            style={{
              marginTop: "3rem",
              marginBottom: "3rem",
            }}
          >
            <Grid
              xs={6}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItem: "center",
              }}
            >
              <img
                src={Logo}
                style={{
                  width: "21.875rem",
                  maxWidth: "21.875rem",
                  maxHeight: "10.88rem",
                }}
                alt="logo"
              />
            </Grid>
            <Grid
              xs={6}
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "right",
                paddingRight: "2rem",
              }}
            >
              <Typography color="textPrimary" variant="h1">
                Estado de cuenta
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            container
            spacing={2}
            xs={12}
            maxWidth={false}
            style={{
              marginTop: "3rem",
              marginBottom: "3rem",
            }}
          >
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
                      Compras:
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
          <Grid
            item
            xs={12}
            style={{
              paddingBottom: "4rem",
            }}
          >
            {/* lista de ordenes */}
            <Card raised style={{ margin: "1.2rem" }}>
              <CardHeader title="Desglose de ordenes" />
              <Divider />
              <PerfectScrollbar>
                <Box
                  style={{
                    overflow: "auto",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Ref Orden</TableCell>
                        <TableCell align="left">Fechas</TableCell>
                        <TableCell align="left">Compras</TableCell>
                        <TableCell align="left">Pagos</TableCell>
                        <TableCell align="left">Saldos</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ordenesDelCliente?.map((obj, i) => {
                        return (
                          <TableRow hover key={i}>
                            <TableCell align="left">{obj.orden_id}</TableCell>
                            <TableCell align="left">{obj.fecha}</TableCell>
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
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "2rem",
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              {`Fecha generado: ${moment().format("YYYY-MM-DD")}`}
            </Typography>
          </Grid>
        </Container>
      ) : (
        <BackdropSpinner isLoading={!isFetching} />
      )}
    </>
  );
}

export default withRouter(Factura);
