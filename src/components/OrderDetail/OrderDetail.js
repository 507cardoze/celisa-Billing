import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  avatar: {
    height: 100,
    width: 100,
  },
}));

const OrderDetails = ({ className, orden, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container spacing={2} maxWidth="lg">
          <Grid item xs={6}>
            <Box alignItems="flex-start" display="flex" flexDirection="column">
              <Typography color="textPrimary" gutterBottom variant="h3">
                {`Orden #${13}`}
              </Typography>
              <Grid xs={12}>
                <Typography color="textSecondary" variant="body1">
                  {`vendedor: ${"antho"}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`Correo: ${"email@aeronaval.gob.pa"}`}
                </Typography>
              </Grid>
              <Grid xs={12}>
                <Typography color="textSecondary" variant="body1">
                  {`vendedor: ${"antho"}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`Correo: ${"email@aeronaval.gob.pa"}`}
                </Typography>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box alignItems="flex-start" display="flex" flexDirection="column">
              <Typography color="textPrimary" gutterBottom variant="h3">
                {`Pedido #${16}`}
              </Typography>
              <Grid xs={12}>
                <Typography color="textSecondary" variant="body1">
                  {`vendedor: ${"antho"}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`Correo: ${"email@aeronaval.gob.pa"}`}
                </Typography>
              </Grid>
              <Grid xs={12}>
                <Typography color="textSecondary" variant="body1">
                  {`vendedor: ${"antho"}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`Correo: ${"email@aeronaval.gob.pa"}`}
                </Typography>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
    </Card>
  );
};

OrderDetails.propTypes = {
  className: PropTypes.string,
};

export default OrderDetails;
