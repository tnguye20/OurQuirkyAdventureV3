import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { useAuthValue } from '../contexts/';

export const useMemories = () => {
  const { authUser } = useAuthValue();
  const [ memories, setMemories ] = useState([]);
  // const [ cities, setCities ] = useState([]);
  // const [ states, setStates ] = useState([]);
  // const [ takenMonths, setMonths ] = useState([]);
  // const [ takenYears, setYears ] = useState([]);
  const [ filterBy, setFilterBy ] = useState([]);

  const [ filterObject, setFilterObject ] = useState({
    cities: [],
    states: [],
    takenMonths: [],
    takenYears: []
  });

  useEffect(() => {
    let unsubscribe = db
      .collection("memories")
      .where("user", "==", authUser.uid )
      .orderBy("takenDate");

    // if( filterBy.length > 0){
    //   unsubscribe = unsubscribe.where("tags", "array-contains-any", filterBy)
    // }
    // unsubscribe = unsubscribe.orderBy("takenDate");
    const _cities = new Map();
    const _states = new Map();
    // const _takenDates = new Map();
    const _takenMonths = new Map();
    const _takenYears = new Map();
    unsubscribe = unsubscribe.onSnapshot( snapshot => {
      const snapshotMemories = snapshot.docs.reduce( (filtered, memory) => {
        const data = memory.data();
        const { isConverting , city, state, takenMonth, takenYear } = data;

        if(!_cities.has(city) && city !== "" && city !== undefined) _cities.set(city, {});
        if(!_states.has(state) && state !== "" && state !== undefined) _states.set(state, {});
        // if(!_takenDates.has(takenDate) && takenDate !== "" && takenDate !== undefined) _takenDates.set(takenDate, {});
        if(!_takenYears.has(takenYear) && takenYear !== "" && takenYear !== undefined) _takenYears.set(takenYear, {});
        if(!_takenMonths.has(_takenMonths) && takenMonth !== "" && takenMonth !== undefined) _takenMonths.set(takenMonth, {});

        if ( isConverting !== true ) {
          filtered.push({
            id: memory.id,
            ...data
          })
        }
        return filtered;
      }, []);
      // setCities(Array.from(_cities.keys()).sort( (a,b) => a > b));
      // setStates(Array.from(_states.keys()).sort( (a,b) => a > b));
      // setMonths(Array.from(_takenMonths.keys()).sort( (a,b) => a > b));
      // setYears(Array.from(_takenYears.keys()).sort( (a,b) => a > b));
      setFilterObject({
        cities: Array.from(_cities.keys()).sort( (a,b) => a > b),
        states: Array.from(_states.keys()).sort( (a,b) => a > b),
        takenMonths: Array.from(_takenMonths.keys()).sort( (a,b) => a > b),
        takenYears: Array.from(_takenYears.keys()).sort( (a,b) => a > b),
      });
      setMemories(snapshotMemories);
    });

    return () => unsubscribe();
  }, [authUser.uid, filterBy])

  return {
    memories,
    // cities,
    // states,
    // takenMonths,
    // takenYears,
    filterObject,
    setMemories,
    filterBy,
    setFilterBy
  }
}
