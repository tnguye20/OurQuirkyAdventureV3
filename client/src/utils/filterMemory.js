const isUnion = ( arr1, arr2, arrFlag=false ) => {
    const base = arr1.length >= arr2.length ? arr2 : arr1;
    const target = arr1.length >= arr2.length ? arr1 : arr2;
    // const baseMap = new Map();
    // base.forEach( item => baseMap.set(item, 0));
    const baseMap = arrayToMap(base);
    let result = false;
    const union = [];
    for ( let i = 0; i < target.length; i++ ){
      if(baseMap.has(target[i])){
        result = true;
        if (!arrFlag) break;
        union.push(target[i]);
      }
    }
    if (arrFlag) return union;
    return result;
}

const arrayToMap = (arr) => {
  const midpoint = Math.floor(arr.length / 2);
  const map = new Map();
  if (arr.length % 2 !== 0) map.set(arr[midpoint], 0);
  for ( let i = 0; i < midpoint; i++ ){
    if(!map.has(arr[i])) map.set(arr[i], 0);
    if(!map.has(arr[arr.length - 1 - i])) map.set(arr[i], 0);
  }
  return map;
}

const memFilter = ( memories, filterCriteria ) => {
  const included = memories.filter( memory => {
    if ( iOS() && memory.mimetype.indexOf("video") !== -1 ) return false;
    if( filterCriteria.size === 0 ) return true;
    const included = Array.from(filterCriteria.keys()).reduce( (included, key) => {
      if ( memory[key] !== undefined ){
        if ( key === "tags" ) return included && isUnion(filterCriteria.get(key), memory.tags);
        if ( key === "mimetype") {
          if (filterCriteria.get(key) === "all"){
            return included && true;
          } else {
            return included && memory.mimetype.indexOf(filterCriteria.get(key)) !== -1;
          }
        }
        return included && filterCriteria.get(key).indexOf(memory[key]) !== -1;
      }
      return false;
    }, true);
    // console.log(included);
    return included;
  });

  return included;
}

const iOS = () => {
  return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

export {
  isUnion,
  memFilter,
}
