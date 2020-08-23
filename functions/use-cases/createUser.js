const { makeUser } = require('../models/Users');

module.exports.makeCreateUser = ( {dba, auth} ) => {
  return async (userInfo) => {
    try{
      const userModel = makeUser(userInfo);
      let id = userModel.getID();
      let emailVerified = userModel.isVerified();
      const email = userModel.getEmail();
      const password = userModel.getPassword();
      const { dbOnly } = userInfo;

      if ( dbOnly !== true && id !== undefined ){
        const { user } = await auth.createUserWithEmailAndPassword(email, password);
        id = user.uid;
        emailVerified = user.emailVerified;
      }

      userModel.setID = id;
      userModel.setEmail = email;
      userModel.setIsVerified = isVerified;
      await dba.insertUser(userModel.getData());

      if ( dbOnly !== true && id !== undefined ){
        const token = await user.getIdToken();
        userModel.setToken(token);
      }
      return userModel.getData();

    } catch (e) {
      console.log(e);
      return {
        error: "Insufiicient User Data"
      }
    }
  }
}
