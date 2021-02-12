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

  //   const data = {
  //     labels: ["Thing 1", "Thing 2", "Thing 3", "Thing 4", "Thing 5", "Thing 6"],
  //     datasets: [
  //       {
  //         label: "# of Votes",
  //         data: [2, 9, 3, 5, 2, 3],
  //         backgroundColor: "rgba(255, 99, 132, 0.2)",
  //         borderColor: "rgba(255, 99, 132, 1)",
  //         borderWidth: 1,
  //       },
  //     ],
  //   };

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
    <Card className={clsx(classes.root, className)} {...rest}>
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
