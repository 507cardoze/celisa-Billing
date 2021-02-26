import React from "react";
import { Grid } from "@material-ui/core";
import BackButton from "../../components/BackButton/BackButton";
import { useQuery } from "react-query";
import { useIsFetching } from "react-query";
import { useHistory } from "react-router-dom";
import * as fetch from "../../helpers/fetch";
import * as url from "../../helpers/urls";

function ReportePreview({ match }) {
  const { desde, hasta, type, data } = match.params;
  const history = useHistory();
  const header = fetch.requestHeader("GET", null, localStorage.token);
  const urlGeneral = url.getDataReporteGeneral();
  const isFetching = useIsFetching();

  const fetchReporte = async (url, header) => {
    const res = await window.fetch(url, header);
    const decoded = await res.json();
    fetch.UnauthorizedRedirect(decoded, history);
    return decoded;
  };

  const { data: reporteQuery } = useQuery(
    ["reporteGeneral", urlGeneral, desde],
    () => fetchReporte(`${urlGeneral}?desde=${desde}&hasta=${hasta}`),
    {
      staleTime: 300000,
    },
    header,
  );

  return (
    <Grid
      container
      spacing={5}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Grid item xs={12} container spacing={2}>
        <BackButton
          texto="volver al inicio"
          style={{ marginRight: ".5rem" }}
          ruta={`/reportes`}
        />
        <BackButton
          texto="Atras"
          ruta={`/reportes/buscar/${match.params.type}`}
        />
      </Grid>
    </Grid>
  );
}

export default ReportePreview;
