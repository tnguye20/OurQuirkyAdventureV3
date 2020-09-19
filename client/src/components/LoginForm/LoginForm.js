import React, { useState } from 'react';
import { useAuthValue } from '../../contexts';
import { auth } from '../../utils/firebase';
import {
  TextField,
  Button,
  Collapse
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { useHistory } from 'react-router-dom';
import { useAlert } from '../../hooks/useAlert';

import * as ALERT_TYPES from '../../constants/alerts';

export const LoginForm = () => {
  const { setAuthUser } = useAuthValue();
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const history = useHistory();
  const { alertOpen, alertType, alertMsg, setAlertOpen, setAlertMsg, setAlertType } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertOpen(false);
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      user.getIdToken(true).then( (idToken) => {
        setAlertMsg(ALERT_TYPES.ALERT_SUCCESS_LOGIN_MSG);
        setAlertType(ALERT_TYPES.ALERT_SUCCESS);
        setAlertOpen(true);
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("uid", user.uid);
        user.tokenId = idToken;
        setAuthUser(user);
        history.push("/slide");
      });
    } catch (err) {
      const { message } = err;
      if ( message !== undefined ){
        setAlertMsg(message);
      } else {
        setAlertMsg(ALERT_TYPES.ALERT_DEFAULT_MSG);
      }
      setAlertType(ALERT_TYPES.ALERT_ERROR);
      setAlertOpen(true);
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

      <form noValidate autoComplete="off" method="POST" action="/login" onSubmit={handleSubmit}>
        <TextField
          autoFocus
          id="email"
          color="secondary"
          label="Email"
          fullWidth
          onChange={e => setEmail(e.target.value)}
        />
        <br /><br /><br />
        <TextField
          id="password"
          type="password"
          color="secondary"
          label="Password"
          fullWidth
          onChange={e => setPassword(e.target.value)}
        />
        <br /><br /><br />
        <Button variant="contained" color="secondary" fullWidth type="submit">
          Login
        </Button>
      </form>
    </>
  )
}
