import React from 'react';
import {
  Grid,
  Container,
  Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { SignupForm } from '../SignupForm';

export const Signup = () => {
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
          <Link to="/" className="header">
            <Typography
              align="center"
              variant="h1"
              component="h2"
              gutterBottom
            >
              Our Quirky Adventure
            </Typography>
          </Link>
          <SignupForm />
        </Grid>
      </Grid>
    </Container>
  )
}
