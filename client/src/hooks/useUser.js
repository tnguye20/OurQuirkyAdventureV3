import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { useAuthValue } from '../contexts/';

export const useUser = () => {
  const { authUser } = useAuthValue();
  const [ user, setUser ] = useState({
    collections: [],
  });

  useEffect(() => {
    let unsubscribe = db
      .collection("users")
      .doc( authUser.uid );

    unsubscribe = unsubscribe.onSnapshot( doc => {
      setUser({
          id: doc.id,
          ...doc.data()
      });
    });
    
    return () => unsubscribe();
  }, [authUser.uid])

  return {
    user,
    setUser
  }
}
