import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { Link } from "react-router-dom";
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
  root: {},
  exportButton: {
    fontWeight:"bold",
    marginRight: theme.spacing(1)
  },
  searchResults:{
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    maxHeight: 150,
    overflowY: "auto"
  },
  a: {
    textDecoration:"none",
    color: "black",
    fontWeight: "bold"
  },
  submit: {
    backgroundColor: theme.palette.secondary.main,
    fontWeight:"bold"
  },

}));

const Toolbar = ({ className,isLoading, ...rest }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button className={classes.exportButton} disable={isLoading}>
          Exportar
        </Button>
        <Button
          color="primary"
          variant="contained"
          className={`${classes.submit}`}
          disable={isLoading}
        >
          Agregar usuario
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                disable={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Buscar usuario"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
      >
      </Box>
      {!isLoading && <Card>
          <CardContent className="search-box" >
          <Box className={`${classes.searchResults}`} >
             <List component="nav" aria-label="results">
                <Link className={`${classes.a}`}>
                    <ListItem button>
                        <ListItemText primary="Lourdez apellido - correo electronico" />
                    </ListItem>
                </Link>
                <Divider light />
            </List>
          </Box>
          </CardContent>
      </Card>}
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;