import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { useAuthValue } from '../contexts/';

export const useMemories = () => {
  const { authUser } = useAuthValue();
  const [ memories, setMemories ] = useState([]);

  useEffect(() => {
    let unsubscribe = db
      .collection("memories")
      .where("user", "==", authUser.uid )
      .orderBy("createdDate");

    unsubscribe = unsubscribe.onSnapshot( snapshot => {
      const snapshotMemories = snapshot.docs.reduce( (filtered, memory) => {
        filtered.push({
          id: memory.id,
          ...memory.data()
        })
        return filtered;
      }, []);

      setMemories(snapshotMemories);
    });

    return () => unsubscribe();
  }, [authUser.uid])

  return {
    memories,
    setMemories
  }
}
