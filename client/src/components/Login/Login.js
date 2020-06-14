import React from 'react';
import {
  Grid,
  Container
} from '@material-ui/core';
import { LoginForm } from '../LoginForm';

export const Login = () => {
  return (
    <Container maxWidth="md">
      <Grid
        container
        spacing={0}
        direction="column"
        justify="center"
        style={{ minHeight: '100vh'}}
      >
        <Grid item xs={12} sm={12}>
          <LoginForm />
        </Grid>
      </Grid>
    </Container>
  )
}
