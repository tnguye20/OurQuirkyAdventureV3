import { useState, useEffect } from 'react';
import { auth } from '../utils/firebase';

export const useAuth = () => {
  const idToken = localStorage.getItem("idToken");
  const uid = localStorage.getItem("uid");
  const [ authUser, setAuthUser ] = useState( (idToken !== null && uid !== null) ? {uid, idToken} : null );

  useEffect( () => {
    console.log("We here dude");
    const unsubscribe = auth.onAuthStateChanged( user => {
      if(user){
        user.getIdToken(true).then( (idToken) => {
          localStorage.setItem("idToken", idToken);
          localStorage.setItem("uid", user.uid);
          user.tokenId = idToken;
          setAuthUser(user);
        })
      }
    });

    return () => unsubscribe()
  } )

  return {
    authUser,
    setAuthUser
  }
}
