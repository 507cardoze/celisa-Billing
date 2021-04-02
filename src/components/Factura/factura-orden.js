import React, { useRef, useContext } from "react";
//import Pdf from "react-to-pdf";
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
  Button,
} from "@material-ui/core";
import Logo from "../../static/Gris celisa store.png";
import PerfectScrollbar from "react-perfect-scrollbar";
import BackdropSpinner from "../BackDrop/backDrop";
import MainLayout from "../MainLayOut/mainLayout.component";
import { useReactToPrint } from "react-to-print";

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

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

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
        {/* <Pdf
          targetRef={ref}
          filename={`factura-orden-${id_orden}-${moment().format(
            "YYYY-MM-DD",
          )}.pdf`}
          x={10}
          y={10}
          scale={0.9}
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
        </Pdf> */}
        <Button
          variant="contained"
          color="default"
          style={{ fontWeight: "bold" }}
          onClick={handlePrint}
        >
          Descargar en PDF
        </Button>
        {data ? (
          <Container
            maxWidth={false}
            ref={ref}
            style={{ paddingBottom: "2rem", width: "800px" }}
          >
            <Grid
              item
              container
              spacing={2}
              xs={12}
              maxWidth={false}
              style={{
                marginTop: "5rem",
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
                <Card item style={{ width: "100%" }}>
                  <CardContent
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignContent: "flex-start",
                    }}
                  >
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      style={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
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
                  <Card>
                    <CardContent
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignContent: "center",
                        minHeight: "200px",
                      }}
                    >
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        style={{ fontWeight: "bold", fontSize: "1rem" }}
                      >
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
                  <Card>
                    <CardContent
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignContent: "center",
                        minHeight: "200px",
                      }}
                    >
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        style={{ fontWeight: "bold", fontSize: "1rem" }}
                      >
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
              <Card style={{ margin: "1.2rem" }}>
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
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold", fontSize: "1rem" }}
                          >
                            Productos (articulo)
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold", fontSize: "1rem" }}
                          >
                            Talla
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold", fontSize: "1rem" }}
                          >
                            Color
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold", fontSize: "1rem" }}
                          >
                            Cantidad
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold", fontSize: "1rem" }}
                          >
                            Precio Unitario&nbsp;($)
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold", fontSize: "1rem" }}
                          >
                            Precio Total&nbsp;($)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.productos?.map((obj, i) => {
                          return (
                            <TableRow hover key={i}>
                              <TableCell
                                align="left"
                                style={{
                                  fontSize: "0.9rem",
                                }}
                              >
                                {obj.descripcion}
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{
                                  fontSize: "0.9rem",
                                }}
                              >
                                {obj.talla}
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{
                                  fontSize: "0.9rem",
                                }}
                              >
                                {obj.color}
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{
                                  fontSize: "0.9rem",
                                }}
                              >
                                {obj.cantidad}
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{
                                  fontSize: "0.9rem",
                                }}
                              >
                                {`$${fetch.numberWithCommas(
                                  parseFloat(obj.precio).toFixed(2),
                                )}`}
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{
                                  fontSize: "0.9rem",
                                }}
                              >
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
                          <TableCell
                            align="left"
                            style={{ fontSize: "0.9rem" }}
                          >
                            Articulos:{" "}
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ fontSize: "0.9rem" }}
                          >{`${fetch.numberWithCommas(
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
                            style={{ fontWeight: "bold", fontSize: "0.9rem" }}
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
              <Card style={{ margin: "1.2rem" }}>
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
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold", fontSize: "1rem" }}
                          >
                            Fecha de pago
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold", fontSize: "1rem" }}
                          >
                            Tipo de pago
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold", fontSize: "1rem" }}
                          >
                            Monto&nbsp;($)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.pagos?.map((obj, i) => {
                          return (
                            <TableRow hover key={i}>
                              <TableCell
                                component="th"
                                scope="row"
                                style={{
                                  fontSize: "0.9rem",
                                }}
                              >
                                {moment(obj.fecha_pago).format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{
                                  fontSize: "0.9rem",
                                }}
                              >
                                {obj.tipo}
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{
                                  fontSize: "0.9rem",
                                }}
                              >
                                {`$${fetch.numberWithCommas(
                                  parseFloat(obj.cantidad).toFixed(2),
                                )}`}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow>
                          <TableCell
                            align="left"
                            component="th"
                            scope="row"
                          ></TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold", fontSize: "0.9rem" }}
                          >
                            TOTAL:
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ fontWeight: "bold", fontSize: "0.9rem" }}
                          >{`$${fetch.numberWithCommas(
                            data?.pagos?.reduce(sumaArticulos, 0).toFixed(2),
                          )}`}</TableCell>
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
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                style={{ fontWeight: "bold", fontSize: "1rem" }}
              >
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
