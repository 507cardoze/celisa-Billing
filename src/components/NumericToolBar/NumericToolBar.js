import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  CardActions,
} from "@material-ui/core";

const NumericToolBar = ({ setEstado = null, data, ver = false }) => {
  return (
    <Grid
      container
      spacing={1}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {data?.titles.map((value, index) => (
        <Grid item key={index} xl={3} lg={3} md={4} xs={6}>
          <Card style={{ maxHeight: "170px" }} raised>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {value.text}
              </Typography>
              <Typography variant="h5" component="h2">
                {data?.values[index]}
              </Typography>
            </CardContent>
            {ver && (
              <CardActions>
                <Button size="small" onClick={() => setEstado(value.estado)}>
                  Filtrar
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default NumericToolBar;
