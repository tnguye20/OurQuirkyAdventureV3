import { memFilter } from './filterMemory';
import { bytesToMegabytes } from './bytesToMegabytes';

export { bytesToMegabytes };

export { memFilter };

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
