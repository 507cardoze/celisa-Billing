import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  CardActions,
  Box,
} from "@material-ui/core";

const NumericToolBar = ({ setEstado = null, data, ver = false }) => {
  return (
    <Box
      container
      spacing={2}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Grid item xs={12} md={12} lg={12}>
        <Card style={{ maxWidth: 100 * 3 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              {data?.titles[0].text}
            </Typography>
            <Typography variant="h5" component="h2">
              {data?.values[0]}
            </Typography>
          </CardContent>
          {ver && (
            <CardActions>
              <Button
                size="small"
                onClick={() => setEstado(data?.titles[0].estado)}
              >
                Ver
              </Button>
            </CardActions>
          )}
        </Card>
      </Grid>

      {data?.titles.map((value, index) => {
        return (
          index !== 0 && (
            <Grid item xs={6} md={4} lg={2} key={index}>
              <Card>
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
                    <Button
                      size="small"
                      onClick={() => setEstado(value.estado)}
                    >
                      Ver
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          )
        );
      })}
    </Box>
  );
};

export default NumericToolBar;
