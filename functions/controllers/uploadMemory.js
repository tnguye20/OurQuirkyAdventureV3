exports.makeUploadMemory = ({ uploadToBucket }) => {
  return async (req) => {
    try{
      const { user, files } = req;
      if( user !== undefined && files.length > 0 ){
        uploaded = await uploadToBucket({ user, files });
        if(uploaded){
          return {
            body: {
              msg: "Upload Successfully",
            }
          }
        }
        return {
          statusCode: 400,
          body: "Failed to upload file(s)"
        }
      }
      return {
        statusCode: 400,
        body: "No file(s) to upload"
      }
    } catch(e) {
      console.log(e);
      return {
        statusCode: 400,
        body: "Failed to upload file(s)"
      }
    }
  }
}
