import React, { useState } from 'react';
import { useUserValue } from '../../contexts';
import {
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  CircularProgress
} from '@material-ui/core';

import { Account } from './Account';
import { Slide } from './Slide';

export const UserSettings = () => {

  const [ menu, setMenu ] = useState("account");
  const { user } = useUserValue();

  const LeftMenu = (
    <div>
      <List>
        <ListItem button onClick={ e => setMenu("account") }>
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem button onClick={ e => setMenu("slide") }>
          <ListItemText primary="Slide Settings" />
        </ListItem>
      </List>
    </div>
  )

  return (
    <Container maxWidth="md">
      <h1>Settings</h1>
      <Grid container spacing={3} direction="row">
        <Grid item md={3} sm={3} xs={12}>
          { LeftMenu }
        </Grid>
        <Grid item md={9} sm={9} xs={12}>
          {
            user.email === null || user.email === undefined
            ?
              ( <CircularProgress /> )
            :
              (
                menu === "account" ?
                ( <Account user={user} /> )
                : menu === "slide" ?
                ( <Slide user={user} /> )
                : ""
              )
          }
        </Grid>
      </Grid>
    </Container>
  )
}
