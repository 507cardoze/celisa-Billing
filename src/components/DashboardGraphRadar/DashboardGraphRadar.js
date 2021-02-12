import React, { memo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Radar } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  useTheme,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
}));

const DashboardGraphRadar = ({ className, title, dataSet, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  const data = dataSet;

  const options = {
    scale: {
      ticks: { beginAtZero: true },
    },
    animation: false,
    cutoutPercentage: 50,
    layout: { padding: 0 },
    legend: {
      display: true,
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest} raised>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        <Box height={300} position="relative">
          <Radar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

DashboardGraphRadar.propTypes = {
  className: PropTypes.string,
};

export default memo(DashboardGraphRadar);
