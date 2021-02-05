import React, { memo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
} from "@material-ui/core";

import { numberWithCommas } from "../../helpers/fetch";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56,
  },
});

const DashbordCard = ({
  className,
  title,
  color,
  Icon,
  data,
  description,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={1}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h4">
              {title}
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {numberWithCommas(data)}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              className={classes.avatar}
              style={{ backgroundColor: color }}
            >
              <Icon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={1} display="flex" alignItems="center">
          <Typography color="textSecondary" variant="caption">
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

DashbordCard.propTypes = {
  className: PropTypes.string,
};

export default memo(DashbordCard);
