import React, { useState } from 'react';
import { db } from '../../../utils/firebase';
import {
  Collapse,
  TextField,
  Chip,
  makeStyles,
  Button,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import * as ALERT_TYPES from '../../../constants/alerts';

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export const Account = ( { user } ) => {
  const classes = useStyles();

  const [ alertOpen, setAlertOpen ] = useState(false);
  const [ alertType, setAlertType ] = useState(ALERT_TYPES.ALERT_SUCCESS);
  const [ alertMsg, setAlertMsg ] = useState(ALERT_TYPES.ALERT_SUCCESS_MSG);
  const [ displayName, setDisplayName ] = useState(user.displayName === undefined ? "" : user.displayName);
  const [ email, setEmail ] = useState(user.email === undefined ? "" : user.email);

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();
      const _user = {
        displayName,
        // email
      }
      await db.collection("users").doc(user.id).update(_user);
      setAlertType(ALERT_TYPES.ALERT_SUCCESS);
      setAlertOpen(true);
    } catch (error) {
      switch(error.type){
        default: setAlertMsg("Internal Error. Please Check Back Later");
      }
      setAlertType(ALERT_TYPES.ALERT_ERROR);
      setAlertOpen(true);
      console.log(error);
    }
  }

  return (
    <>
      <Collapse in={alertOpen}>
        <Alert
          severity={alertType}
          onClose={() => setAlertOpen(false)}
        >
          { alertMsg }
        </Alert>
        <br />
      </Collapse>

      <h3>Account Settings</h3>
      <form autoComplete="off" onSubmit={handleUpdate}>
        <TextField onChange={e => setDisplayName(e.target.value)} label="Display Name" id="displayName" value={ displayName } fullWidth margin="normal" variant="outlined"/>
        <TextField disabled onChange={e => setEmail(e.target.value)} label="Email" id="email" value={ email } fullWidth margin="normal" variant="outlined"/>
        <div>
          {
            user.collections.map( (collection, index) => (
              <Chip
                key={index}
                size="small"
                color="primary"
                label={collection}
                className={classes.chip}
              />
            ))
          }
        </div>
        <br />
        <Button
            color="primary"
            variant="contained"
            type="submit"
        >
            Update
        </Button>
      </form>
    </>
  )
}
