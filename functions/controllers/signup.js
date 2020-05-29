
const makeSignup = ({ createUser }) => {
  return async (req) => {
    try{
      newUser = await createUser(req.body);

      if(newUser.uid !== undefined){
        return {
          body: {
            msg: "User Created Successfully",
            user: newUser
          }
        }
      }
      return {
        statusCode: 400,
        body: newUser
      }
    } catch(e) {
      console.log(e);
      return {
        statusCode: 400,
        body: e
      }
    }
  }
}

module.exports = {
  makeSignup
}
