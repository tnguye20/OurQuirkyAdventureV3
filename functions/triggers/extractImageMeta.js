const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const spawn = require('child-process-promise').spawn;
const nodeGeocoder = require('node-geocoder');
let options = {
  provider: 'openstreetmap'
}
let geoCoder = nodeGeocoder(options);

const { db, storage } = require('../admin');
const {
  geoCalculate,
  imageMagickOutputToObject
} = require('../utils');

exports.extractImageMeta = async ( object ) => {
  const filePath = object.name;
  const fileName = filePath.split("/").pop();

  // Create random filename with same extension as uploaded file.
  const randomFileName = crypto.randomBytes(20).toString('hex') + path.extname(filePath);
  const tempLocalFile = path.join(os.tmpdir(), randomFileName);

  if (!object.contentType.startsWith('image/')) {
    console.log(fileName + ' this is not an image.');
    return null;
  }

  try {
    await storage.file(filePath).download({destination: tempLocalFile});
    const result = await spawn('identify', ['-verbose', tempLocalFile], {capture: ['stdout', 'stderr']});
    const metadata = imageMagickOutputToObject(result.stdout);
    let latitude = metadata.Properties["exif:GPSLatitude"];
    let latRef = metadata.Properties["exif:GPSLatitudeRef"];
    let longitude = metadata.Properties["exif:GPSLongitude"];
    let longRef = metadata.Properties["exif:GPSLongitudeRef"];
    let originalDate = metadata.Properties["exif:DateTimeOriginal"];
    let updatedMetadata = {};
    if ( originalDate !== undefined ){
      const takenDate = new Date(originalDate.trim().replace(/(\d+):(\d+):(\d+) /, "$1/$2/$3 ")).toISOString();
      updatedMetadata = { takenDate };
    }
    if(latitude !== undefined && longitude !== undefined){
      latitude = geoCalculate(latitude, latRef);
      longitude = geoCalculate(longitude, longRef);
      let location = await geoCoder.reverse({ lat: latitude, lon: longitude });
      location = location[0];
      const gpsInfo = {};
      Object.entries(location).forEach( item => {
        let [ key, value ] = item;
        gpsInfo[key] = value === undefined || value === null ? "" : value;
      });
      console.log(fileName);
      console.log(gpsInfo);
      Object.assign(updatedMetadata, gpsInfo);
    }
    const memories = await db.collection("memories").where("name", "==", fileName).get();
    memories.forEach( async memory =>{
      if ( memory.exists ){
        await db.collection("memories").doc(memory.id).update(updatedMetadata);
      }
    })
    fs.unlinkSync(tempLocalFile);
    return "Update Succesfull"
  } catch (e) {
    console.log(e);
    fs.unlinkSync(tempLocalFile);
    return "Error Occured";
  }

}
