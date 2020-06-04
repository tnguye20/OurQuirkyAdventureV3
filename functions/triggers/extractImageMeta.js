const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const spawn = require('child-process-promise').spawn;

const { db, storage } = require('../admin');
const {
  geoCalculate,
  imageMagickOutputToObject
} = require('../utils');

exports.extractImageMeta = async ( object, context ) => {
  try {
    const filePath = object.name;
    const fileName = filePath.split("/").pop();

    // Create random filename with same extension as uploaded file.
    const randomFileName = crypto.randomBytes(20).toString('hex') + path.extname(filePath);
    const tempLocalFile = path.join(os.tmpdir(), randomFileName);

    if (!object.contentType.startsWith('image/')) {
      console.log('This is not an image.');
      return null;
    }

    await storage.file(filePath).download({destination: tempLocalFile});
    const result = await spawn('identify', ['-verbose', tempLocalFile], {capture: ['stdout', 'stderr']});
    const metadata = imageMagickOutputToObject(result.stdout);
    let latitude = metadata.Properties["exif:GPSLatitude"];
    let latRef = metadata.Properties["exif:GPSLatitudeRef"];
    let longitude = metadata.Properties["exif:GPSLongitude"];
    let longRef = metadata.Properties["exif:GPSLongitudeRef"];
    if(latitude !== unescape && longitude !== undefined){
      latitude = geoCalculate(latitude, latRef);
      longitude = geoCalculate(longitude, longRef);
      let location = await geoCoder.reverse({ lat: latitude, lon: longitude });
      location = location[0];
      await db.collection("memories").where("name", "==", fileName).update(location);
    }
    fs.unlinkSync(tempLocalFile);
    return "Clean Up Successful";
  } catch (e) {
    return e;
  }
}
