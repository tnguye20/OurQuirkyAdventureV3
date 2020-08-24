import React, { useState } from 'react';
import { useAuthValue } from '../../contexts';
import { auth, db } from '../../utils/firebase';
import {
  TextField,
  Button
} from '@material-ui/core';

// import axios from 'axios';
// import { API_SIGNUP } from '../../constants/routes';

export const SignupForm = () => {
  const { setAuthUser } = useAuthValue();
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ displayName, setDisplayName ] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      const { uid, emailVerified } = user;
      console.log(uid);
      console.log(displayName);
      // const formData = { id: uid, email, password, displayName, emailVerified, dbOnly: true };
      // axios.post( API_SIGNUP, formData )
      //   .then( newUser => {
      //     setAuthUser(user);
      //   })
      //   .catch( error => {
      //     console.log(error.toJSON());
      //   })
      await db.collection("users").doc(uid).set({
        displayName,
        email,
        associations: [],
        collections: []
      });
      setAuthUser(user);
    } catch (error) {
      console.log(error);
    }
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
