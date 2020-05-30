const makeSignin = ({ authUser }) => {
  return async (req) => {
    try{
      const user = await authUser(req.body);

      if(user.uid !== undefined){
        return {
          body: {
            msg: "Login Successfully",
            ...user
          }
        }
      }

      return {
        statusCode: 400,
        body: {...user}
      }
    } catch(e) {
      console.log(e);
      return {
        statusCode: 400,
        body: "Internal Server Error"
      }
    }
  }
}

module.exports = {
  makeSignin
}
