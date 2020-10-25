import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';


const useStyles = makeStyles(() => ({
  avatar: {
    height: 100,
    width: 100
  }
}));

const Profile = ({ className,userDetails, ...rest }) => {
  const classes = useStyles();
  const firstLetter = userDetails.name.slice(0,1);
  const secondLetter = userDetails.lastname.slice(0,1);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
      <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Avatar className={classes.avatar}>{`${firstLetter}${secondLetter}`}</Avatar>
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {`${userDetails.name} ${userDetails.lastname}`}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            {`${userDetails.pais} , ${userDetails.address}`}
          </Typography>
          <Typography
            className={classes.dateText}
            color="textSecondary"
            variant="body1"
          >
            {`${moment().format('hh:mm A')} ${process.env.REACT_APP_TZ}`}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;