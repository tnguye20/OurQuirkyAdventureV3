const config = require("../config");

exports.makeUploadToBucket = ({ storage, Jimp, dba, uuid, makeMemory }) => {
  return async ({ user, files }) => {
    try{
      const bucketName = `${user.uid}`;
      const uploadPromises = [];
      for ( const file of files ){
        let { mimetype, buffer, nameOnly, category, extension } = file;
        console.log(file);
        const fullPath = `${bucketName}/${category}/${nameOnly}_${Date.now()}.${extension}`;
        const token = uuid();
        console.log(token);
        switch(category){
          case 'image':
            // const image = await Jimp.read(buffer);
            // console.log(image);
            // buffer = await image.rotate(270).getBufferAsync(mimetype);
          default:
            uploadPromises.push(
              storage.file(fullPath).save(buffer, {
                metadata: {
                  contentType: mimetype,
                  metadata: {
                      firebaseStorageDownloadTokens: token
                  }
                }
              }).then( file => {
                const escapedPath = fullPath.replace(/\//g, "%2F");
                dba.insertMemory(makeMemory({
                  user: user.uid,
                  url: config.resourceBaseURL.replace("<path>", escapedPath).replace("<token>", token),
                  createdDate: new Date().toISOString()
                }));
              })
            )
            break;
        }
      }
      await Promise.all(uploadPromises);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
