import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import { useStickyState } from "../../helpers/fetch";
import SeleccionPedidos from "../../components/SeleccionPedidos/SeleccionPedidos";
import ClientDataForm from "../../components/ClientDataForm/ClientDataForm";
import SeleccionProductos from "../../components/SeleccionProductos/SeleccionProductos";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import { OrderContext } from "../../Context/OrderContext";
import { UserContext } from "../../Context/userContext";
import PreviewOrden from "../../components/PreviewOrden/PreviewOrden";
import * as url from "../../helpers/urls";
import * as fetch from "../../helpers/fetch";
import * as toast from "../../helpers/toast";
import { useHistory } from "react-router-dom";
import BackdropSpinner from "../../components/BackDrop/backDrop";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontWeight: "bold",
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

const getSteps = () => {
  return [
    "Selección de pedido para la orden",
    "Ingresa los datos del cliente de esta orden",
    "Ingreso de productos en esta venta con su datos",
    "Revisión de orden antes de procesar la venta",
  ];
};

const getStepContent = (step) => {
  switch (step) {
    case 0:
      return <SeleccionPedidos />;
    case 1:
      return <ClientDataForm />;
    case 2:
      return <SeleccionProductos />;
    case 3:
      return <PreviewOrden />;
    default:
      return "Unknown step";
  }
};

function NewOrders() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useStickyState(0, "activeStep");
  const [orden, setOrden] = useContext(OrderContext);
  const [user] = useContext(UserContext);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const steps = getSteps();

  const getStepButton = (step) => {
    switch (step) {
      case 0:
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.button}
            disabled={orden?.id_pedido === null ? true : false}
          >
            Siguiente
          </Button>
        );
      case 1:
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.button}
            disabled={orden?.id_cliente === null ? true : false}
          >
            Siguiente
          </Button>
        );
      case 2:
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.button}
            disabled={orden?.productos?.length === 0 ? true : false}
          >
            Siguiente
          </Button>
        );
      case 3:
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCompletarOrden}
            className={classes.button}
          >
            Completar
          </Button>
        );

      default:
        return `no hay links`;
    }
  };

  const handleNext = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleReset = () => setActiveStep(0);
  const handleMovingSteps = (num) => setActiveStep(num);

  const handleResetOrden = () =>
    setOrden({
      id_pedido: null,
      id_cliente: user.rol === "Administrador" ? null : user.id_cliente,
      nombre_cliente:
        user.rol === "Administrador" ? null : `${user.name} ${user.lastname}`,
      numero_cliente: user.rol === "Administrador" ? null : user.number,
      direccion_cliente: user.rol === "Administrador" ? null : user.address,
      productos: [],
    });

  const getdataURL = url.activosPedidosUrl();
  const crearOrdenURL = url.crearOrdenesUrl();
  const header = fetch.requestHeader("GET", null, localStorage.token);

  const body = JSON.stringify({
    orden: orden,
  });

  const headerPost = fetch.requestHeader("POST", body, localStorage.token);

  const fetchData = async (url, header) => {
    setIsLoading(true);
    const loggedInfo = await fetch.fetchData(url, header);
    fetch.UnauthorizedRedirect(loggedInfo, history);
    setIsLoading(false);
    return loggedInfo;
  };

  const handleCompletarOrden = async () => {
    //validar que todo este correcto
    if (!orden.id_pedido) return handleReset();
    if (!orden.id_cliente) return handleMovingSteps(1);
    if (orden?.productos?.length <= 0) return handleMovingSteps(2);

    // verificar que el pedido este aun activo antes de crear la orden

    const pedidosActivos = await fetchData(getdataURL, header);
    const vefifyPedidoActual = pedidosActivos.map(
      (value) => value.pedido_id === orden.id_pedido,
    );
    if (!vefifyPedidoActual || vefifyPedidoActual?.length === 0) {
      setOrden({
        ...orden,
        id_pedido: null,
      });
      handleReset();
    }

    // a este punto toda la orden esta correcta y todo operativo

    const crearOrden = await fetchData(crearOrdenURL, headerPost);
    if (crearOrden === "orden creada exitosamente") {
      handleNext();
    } else {
      return toast.errorToast(crearOrden);
    }
  };

  useEffect(() => {
    const handleMovingSteps = (num) => setActiveStep(num);
    if (!orden?.id_pedido) return handleMovingSteps(0);
  }, [orden, setOrden, user, setActiveStep, history]);

  return (
    <MainLayout Tittle="Crear Orden">
      <BackdropSpinner isLoading={!isLoading} />
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexDirection: "column",
                overflowY: "auto",
                width: "100%",
              }}
            >
              {getStepContent(index)}
              <div className={classes.actionsContainer}>
                <div>
                  {activeStep !== 0 && (
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Atras
                    </Button>
                  )}

                  {getStepButton(activeStep)}
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleReset();
            handleResetOrden();
          }}
          className={classes.button}
        >
          Crear Nueva Orden
        </Button>
      )}
    </MainLayout>
  );
}

export default NewOrders;
