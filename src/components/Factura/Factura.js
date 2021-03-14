import React, { useRef, useContext } from "react";
import Pdf from "react-to-pdf";
import moment from "moment";
import { useQuery } from "react-query";
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
import BackdropSpinner from "../BackDrop/backDrop";
import MainLayout from "../../components/MainLayOut/mainLayout.component";

function FacturaOrden({ match }) {
  const ref = useRef(null);
  const urlGet = url.getByIdOrdenUrl();
  const history = useHistory();
  const [user] = useContext(UserContext);
  const isFetching = useIsFetching();
  const header = fetch.requestHeader("GET", null, localStorage.token);
  const id_orden = parseInt(match.params.id_orden);
  const fetchData = async (url, header) => {
    fetch.UserRedirect(user, history);
    const res = await window.fetch(url, header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const suma = (acc, cur) => acc + Number(cur.cantidad) * Number(cur.precio);

  const sumaPagos = (acc, cur) => acc + Number(cur.cantidad);

  const sumaArticulos = (acc, cur) => acc + Number(cur.cantidad);

  const { data } = useQuery(["orden_data", id_orden, header], () =>
    fetchData(`${urlGet}/${id_orden}`, header),
  );

  return (
    <MainLayout Tittle={`Factura de orden ${id_orden}`}>
      <>
        <Button
          variant="contained"
          color="primary"
          style={{ fontWeight: "bold", marginRight: ".5rem" }}
          onClick={() => history.push(`/edit-orders/${id_orden}`)}
        >
          Volver
        </Button>
        <Pdf
          targetRef={ref}
          filename={`factura-orden-${id_orden}-${moment().format(
            "YYYY-MM-DD",
          )}.pdf`}
          x={-1}
          y={10}
          scale={0.6}
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
        {data ? (
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
                  {`Factura de orden #${id_orden}`}
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
                      {`Nombre: ${data.nombre_cliente}`}
                    </Typography>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {`Direccion: ${data.direccion_cliente}`}
                    </Typography>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {`Numero: ${data.numero_cliente}`}
                    </Typography>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {`Fecha de compra: ${moment(data.fecha_creacion).format(
                        "DD-MMM-YYYY",
                      )}`}
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
                        minHeight: "200px",
                      }}
                    >
                      <Typography color="textSecondary" gutterBottom>
                        Factura total:
                      </Typography>
                      {data?.productos.length > 0 ? (
                        <Typography variant="h5" component="h2" gutterBottom>
                          {`$${fetch.numberWithCommas(
                            data.productos.reduce(suma, 0).toFixed(2),
                          )}`}
                        </Typography>
                      ) : (
                        <Typography variant="h4" component="h2" gutterBottom>
                          No hay productos registrados en esta orden.
                        </Typography>
                      )}
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
                        minHeight: "200px",
                      }}
                    >
                      <Typography color="textSecondary" gutterBottom>
                        Saldo pendiente:
                      </Typography>
                      {data?.productos.length > 0 && data?.pagos.length > 0 ? (
                        <Typography variant="h5" component="h2" gutterBottom>
                          {`$${fetch.numberWithCommas(
                            parseFloat(
                              parseFloat(data.productos.reduce(suma, 0)) -
                                parseFloat(data.pagos.reduce(sumaPagos, 0)),
                            ).toFixed(2),
                          )}`}
                        </Typography>
                      ) : data?.pagos.length > 0 ? (
                        <Typography
                          variant="h5"
                          component="h2"
                          gutterBottom
                        >{`$${fetch.numberWithCommas(
                          parseFloat(
                            0 - parseFloat(data.pagos.reduce(sumaPagos, 0)),
                          ).toFixed(2),
                        )}`}</Typography>
                      ) : (
                        <Typography variant="h4" component="h2" gutterBottom>
                          {`${
                            data?.productos.length === 0
                              ? `No se registran productos en esta compra ${
                                  data?.pagos.length === 0 ? `.` : ""
                                }`
                              : ""
                          } ${
                            data?.pagos.length === 0 &&
                            data?.productos.length === 0
                              ? `y`
                              : ""
                          } ${
                            data?.pagos.length === 0
                              ? `Aún no se registran pagos.`
                              : ""
                          }`}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {/* lista de productos */}
              <Card raised style={{ margin: "1.2rem" }}>
                <CardHeader title="Desglose de productos" />
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
                          <TableCell>Productos (articulo)</TableCell>
                          <TableCell align="left">Talla</TableCell>
                          <TableCell align="left">Color</TableCell>
                          <TableCell align="left">Cantidad</TableCell>
                          <TableCell align="left">
                            Precio Unitario&nbsp;($)
                          </TableCell>
                          <TableCell align="left">
                            Precio Total&nbsp;($)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.productos?.map((obj, i) => {
                          return (
                            <TableRow hover key={i}>
                              <TableCell align="left">
                                {obj.descripcion}
                              </TableCell>
                              <TableCell align="left">{obj.talla}</TableCell>
                              <TableCell align="left">{obj.color}</TableCell>
                              <TableCell align="left">{obj.cantidad}</TableCell>
                              <TableCell align="left">
                                {`$${fetch.numberWithCommas(
                                  parseFloat(obj.precio).toFixed(2),
                                )}`}
                              </TableCell>
                              <TableCell align="left">
                                {`$${fetch.numberWithCommas(
                                  parseFloat(obj.precio * obj.cantidad).toFixed(
                                    2,
                                  ),
                                )}`}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow>
                          <TableCell component="th" scope="row"></TableCell>
                          <TableCell align="left"></TableCell>
                          <TableCell align="left">Articulos: </TableCell>
                          <TableCell align="left">{`${fetch.numberWithCommas(
                            data.productos.reduce(sumaArticulos, 0),
                          )}`}</TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold" }}
                          >
                            TOTAL:
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold" }}
                          >
                            {`$${fetch.numberWithCommas(
                              data.productos.reduce(suma, 0).toFixed(2),
                            )}`}
                          </TableCell>
                        </TableRow>
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
                paddingBottom: "4rem",
              }}
            >
              {/* lista de pagos */}
              <Card raised style={{ margin: "1.2rem" }}>
                <CardHeader title="Desglose de pagos" />
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
                          <TableCell align="left">Fecha de pago</TableCell>
                          <TableCell align="left">Tipo de pago</TableCell>
                          <TableCell align="left">Monto&nbsp;($)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.pagos?.map((obj, i) => {
                          return (
                            <TableRow hover key={i}>
                              <TableCell component="th" scope="row">
                                {moment(obj.fecha_pago).format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell align="left">{obj.tipo}</TableCell>
                              <TableCell align="left">
                                {`$${fetch.numberWithCommas(
                                  parseFloat(obj.cantidad).toFixed(2),
                                )}`}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            align="left"
                          ></TableCell>
                          <TableCell style={{ fontWeight: "bold" }}>
                            TOTAL:
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold" }}
                          >{`$${fetch.numberWithCommas(
                            data?.pagos?.reduce(sumaArticulos, 0).toFixed(2),
                          )}`}</TableCell>

                          <TableCell align="left"></TableCell>
                        </TableRow>
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
    </MainLayout>
  );
}

export default FacturaOrden;
