const config = require("../config");

exports.makeUploadToBucket = ({ storage, Jimp, dba, uuid, makeMemory }) => {
  return async ({ user, files, info }) => {
    try{
      const bucketName = `${user.uid}`;
      const uploadPromises = [];
      let index = 0;
      for ( const file of files ){
        let { mimetype, buffer, nameOnly, category, extension, size } = file;
        const now = Date.now();
        const isoString = new Date().toISOString();
        const fullPath = `${bucketName}/${category}/${nameOnly}_${now}.${extension}`;
        const token = uuid();
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
                const { title, comment } = info[index];
                const comments = [comment];
                dba.insertMemory(makeMemory({
                  user: user.uid,
                  url: config.resourceBaseURL.replace("<path>", escapedPath).replace("<token>", token),
                  createdDate: isoString,
                  mimetype,
                  size,
                  category,
                  extension,
                  title,
                  comments,
                  name: `${nameOnly}_${now}.${extension}`,
                }));
              })
            )
            break;
        }
        index = index +1;
      }
      await Promise.all(uploadPromises);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
