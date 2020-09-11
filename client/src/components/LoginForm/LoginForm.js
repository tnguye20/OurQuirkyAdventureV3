import React, { useState } from 'react';
import { useAuthValue } from '../../contexts';
import { auth } from '../../utils/firebase';
import {
  TextField,
  Button
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

export const LoginForm = () => {
  const { setAuthUser } = useAuthValue();
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
          .then( ({ user }) => {
            user.getIdToken(true).then( (idToken) => {
              localStorage.setItem("idToken", idToken);
              localStorage.setItem("uid", user.uid);
              user.tokenId = idToken;
              setAuthUser(user);
              history.push("/slide");
            });
          });
  }

  return (
    <>
      <h4>Login Form</h4>
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
