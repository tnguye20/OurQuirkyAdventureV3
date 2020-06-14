import React, { useState } from 'react';
import { useAuthValue } from '../../contexts';
import { auth, db } from '../../utils/firebase';
import {
  TextField,
  Button
} from '@material-ui/core';

export const SignupForm = () => {
  const { setAuthUser } = useAuthValue();
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ displayName, setDisplayName ] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then( ({ user }) => {
        const { uid, displayName } = user;
        console.log(uid);
        console.log(displayName);
        db.collection("users").doc(uid).set({
          displayName,
          email
        });
        setAuthUser(user);
      })
  }

  return (
    <>
      <h4>Sign Up Form</h4>
      <form noValidate autoComplete="off" method="POST" action="/signup" onSubmit={handleSubmit}>
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
          autoFocus
          id="name"
          color="secondary"
          label="Display Name"
          fullWidth
          onChange={e => setDisplayName(e.target.value)}
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
          Sign Up
        </Button>
      </form>
    </>
  )
}
