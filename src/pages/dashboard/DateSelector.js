import React from "react";
import moment from "moment";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";

function DateSelector({ handleChangeRangoFecha, desde }) {
  return (
    <FormControl item>
      <InputLabel>{`Desde ${desde} hasta hoy, ${moment().format(
        "YYYY-MM-DD",
      )}`}</InputLabel>
      <Select
        value={desde}
        onChange={(e) => handleChangeRangoFecha(e.target.value)}
        inputProps={{
          name: "fecha",
        }}
      >
        <MenuItem value={desde}>
          <em>Seleccione una rango de fecha</em>
        </MenuItem>
        <MenuItem value={moment().subtract(7, "days").format("YYYY-MM-DD")}>
          Últimos 7 dias
        </MenuItem>
        <MenuItem value={moment().subtract(15, "days").format("YYYY-MM-DD")}>
          Última 2 Semana
        </MenuItem>
        <MenuItem value={moment().subtract(1, "months").format("YYYY-MM-DD")}>
          Último Mes
        </MenuItem>
        <MenuItem value={moment().subtract(6, "months").format("YYYY-MM-DD")}>
          Últimos 6 Mes
        </MenuItem>
        <MenuItem value={moment().subtract(2, "years").format("YYYY-MM-DD")}>
          Últimos 2 años
        </MenuItem>
      </Select>
      <FormHelperText>
        Al hacer cambios aqui, se afecta la información mostrada.
      </FormHelperText>
    </FormControl>
  );
}

export default DateSelector;
