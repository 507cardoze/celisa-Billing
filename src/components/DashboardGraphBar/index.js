import React, { memo } from "react";
import PropTypes from "prop-types";
import { HorizontalBar } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from "@material-ui/core";
import ExportCSV from "../ExportExcelButton/ExportExcelButton";
import moment from "moment";

const DashboardGraphBar = ({
  className,
  title,
  content,
  source,
  orientation,
  ...rest
}) => {
  const theme = useTheme();
  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0,
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider,
          },
        },
      ],
    },
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
    <Card className={className} {...rest} raised>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        <Box minHeight={400} position="relative">
          {!orientation ? (
            <Bar data={content} options={options} />
          ) : (
            <HorizontalBar data={content} options={options} />
          )}
        </Box>
      </CardContent>
      <Divider />
      <Box display="flex" justifyContent="flex-end" p={2}>
        <ExportCSV
          label="Exportar"
          csvData={source}
          fileName={`reporte / ${moment().format("YYYY/MM/DD")}`}
        />
      </Box>
    </Card>
  );
};

DashboardGraphBar.propTypes = {
  className: PropTypes.string,
};

export default memo(DashboardGraphBar);
