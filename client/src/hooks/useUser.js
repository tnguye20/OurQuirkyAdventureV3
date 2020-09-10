import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { useAuthValue } from '../contexts/';

export const useUser = () => {
  const { authUser } = useAuthValue();

  let cache = {
    collections: [],
  };
  try{
    cache = localStorage.getItem("userInfo") === null
      ? {
          collections: [],
        }
      : JSON.parse(localStorage.getItem("userInfo"));
  } catch(e) {
    console.log(e);
  }

  const [ user, setUser ] = useState(cache);

  useEffect(() => {
    let unsubscribe = db
      .collection("users")
      .doc( authUser.uid );

    unsubscribe = unsubscribe.onSnapshot( doc => {
      setUser({
          id: doc.id,
          ...doc.data()
      });
      localStorage.setItem("userInfo", JSON.stringify({
          id: doc.id,
          ...doc.data()
      }));
    });

    return () => unsubscribe();
  }, [authUser.uid])

  return {
    user,
    setUser
  }
}
