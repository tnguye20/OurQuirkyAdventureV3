exports.makeUploadToBucket = ({ storage }) => {
  return async ({ user, files }) => {
    try{
      const bucketName = `${user.uid}`;
      const uploadPromises = [];
      for ( const file of files ){
        const { originalname, mimetype, buffer } = file;
        const category = mimetype.split("/")[0];
        switch(category){
          case 'image':
            const fullPath = `${bucketName}/${category}/${originalname}`;
            uploadPromises.push( storage.file(fullPath).save(buffer, {
              metadata: {
                contentType: mimetype,
              }
            }) );
            break;
          default: break;
        }
      }
      results = await Promise.all(uploadPromises);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
