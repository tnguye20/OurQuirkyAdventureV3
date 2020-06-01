import React from 'react';
import {
  Grid
} from '@material-ui/core';
import { SignupForm } from '../SignupForm';

export const Signup = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh'}}
    >
      <Grid item xs={12} sm={6} style={{ width: '35%' }}>
        <SignupForm />
      </Grid>
    </Grid>
  )
}
