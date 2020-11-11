import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Button, makeStyles } from "@material-ui/core";
import * as styles from "../../helpers/styles";

const useStyles = makeStyles((theme) => styles.mainLayOutStyles(theme));

export default function ExportCSV({ isLoading, csvData, fileName, label }) {
  const classes = useStyles();
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className={`${classes.submit} ${classes.excel}`}
      disabled={isLoading ? true : false}
      onClick={() => exportToCSV(csvData, fileName)}
    >
      {label}
    </Button>
  );
}
