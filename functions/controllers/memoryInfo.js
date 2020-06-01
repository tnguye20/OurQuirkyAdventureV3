exports.makeMemoryInfo = ({ postMemoryInfo }) => {
  return async (req) => {
    try{
      const { user } = req;
      let { info } = req.body;
      info = JSON.parse(info);
      info.user = user.uid;
      if( user !== undefined ){
        res = await postMemoryInfo({ info });
        if(res){
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
