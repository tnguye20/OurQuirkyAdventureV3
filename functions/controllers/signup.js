exports.makeSignup = ({ createUser }) => {
  return async (req) => {
    try{
      const newUser = await createUser(req.body);

      // if(newUser.id !== undefined){
        return {
          body: {
            msg: "User Created Successfully",
            ...newUser
          }
        }
      // }
      // return {
      //   statusCode: 400,
      //   body: { ...newUser }
      // }
    } catch(e) {
      console.log(e);
      return {
        statusCode: 400,
        body: e
      }
    }
  }
}
