import { memFilter, isUnion } from './filterMemory';
import { bytesToMegabytes } from './bytesToMegabytes';

export { memFilter, isUnion, bytesToMegabytes };

export const nullReplace = (value, d="") => {
  if ( Array.isArray(value) ) return value.length > 0 ? value : [];
  return value === undefined || value === null ? d : value;
}

export const getImageSource = (image) => {
  const reader = new FileReader();
  return new Promise( ( resolve, reject ) => {
    try{
      reader.onloadend = () => {
        resolve(reader.result);
      }
      reader.readAsDataURL(image);
    } catch(err) {
      reject(err);
    }
  })
}

export const getVideoSource = ( video ) => {
  return new Promise( ( resolve, reject ) => {
    try{
      resolve(URL.createObjectURL(video));
    } catch(err) {
      reject(err);
    }
  })
}
