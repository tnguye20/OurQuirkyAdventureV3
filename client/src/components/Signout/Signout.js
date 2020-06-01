import React, { useEffect } from 'react';
import { auth } from '../../utils/firebase';
import { useAuthValue } from '../../contexts';

export const Signout = () => {
  const { setAuthUser } = useAuthValue();
  useEffect( () => {
    auth.signOut().then( () => {
      setTimeout( () => {
        setAuthUser(null);
        localStorage.removeItem("idToken");
        localStorage.removeItem("uid");
      }, 1500 );
    }).catch( err => {
      console.log(err);
    } )
  })
  return (
    <h4> Signing Out </h4>
  )
}
