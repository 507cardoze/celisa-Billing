import React, { memo, useEffect, useContext } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import { Container } from "@material-ui/core";
import { useHistory, Route } from "react-router-dom";
import ReporteMenu from "./Reporte-menu";
import ReporteContent from "./Reporte-content";
import { UserContext } from "../../Context/userContext";
import * as fetch from "../../helpers/fetch";
import ReportePreview from "./ReportePreview";

function Reportes({ match }) {
  const history = useHistory();
  const [user] = useContext(UserContext);
  useEffect(() => {
    fetch.UserRedirect(user, history);
  }, [user, history]);
  return (
    <MainLayout Tittle="Reportes">
      <Container>
        <Route
          exact
          path={`${match.path}`}
          render={(props) => <ReporteMenu {...props} />}
        />
        <Route
          path={`${match.path}/buscar/:type`}
          render={(props) => <ReporteContent {...props} />}
        />
        <Route
          path={`${match.path}/preview/:desde/:hasta/:type/:data`}
          render={(props) => <ReportePreview {...props} />}
        />
      </Container>
    </MainLayout>
  );
}

export default memo(Reportes);
