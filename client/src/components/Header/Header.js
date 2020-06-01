import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  AppBar, Toolbar, Typography, Button
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
      flexGrow: 1,
    },
  title: {
      flexGrow: 1,
    },
}));

export const Header = () => {
  const history = useHistory();
  const classes = useStyles();

  const handleSignOut = (e) => {
    e.preventDefault();
    history.push("/signout");
  }

  const handleAddStocks = (e) => {
    e.preventDefault();
    history.push("/addStocks");
  }

  return (
    <div>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Typography variant="h6" className={classes.title} onClick={ () => history.push("/") }>
            Our Quirky Adventure
          </Typography>

          <Button color="inherit" onClick={ handleSignOut }>Sign Out</Button>

        </Toolbar>
      </AppBar>
      <br />
    </div>
  );
}
