import { memFilter } from './filterMemory';

export { memFilter }

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
