import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import { useStickyState } from "../../helpers/fetch";
import SeleccionPedidos from "../../components/SeleccionPedidos/SeleccionPedidos";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return [
    "Selección de pedido",
    "Ingreso de productos",
    "Ingresa los datos del cliente",
    "Revisión de orden",
  ];
}

function NewOrders() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useStickyState(0, "activeStep");
  const steps = getSteps();
  const ordenInicial = {
    id_pedido: null,
    productos: [{ descripcion123: "hola mundo" }],
    nombre_cliente: "",
    numero_cliente: "",
    direccion_cliente: "",
  };
  const [orden, setOrden] = useStickyState(ordenInicial, "orden");

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleResetOrden = () => {
    setOrden({
      id_pedido: null,
      productos: [],
      nombre_cliente: "",
      numero_cliente: "",
      direccion_cliente: "",
    });
  };

  const setIdPedido = (id) => {
    setOrden({
      ...orden,
      id_pedido: id,
    });
  };

  useEffect(() => {
    setIdPedido(12);
  }, []);

  return (
    <MainLayout Tittle="Crear Orden">
      <Container maxWidth={false}>
        <div className={classes.root}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            {activeStep === 0 && <SeleccionPedidos />}
            {activeStep === 1 && <h3>productos</h3>}
            {activeStep === 2 && <h3>datos de cliente</h3>}
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}

export default NewOrders;
