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

      const newUser = {
        id,
        email,
        emailVerified,
        displaynName: userModel.getName(),
        associations: userModel.getAssociations(),
        collections: userModel.getCollections()
      };
      await dba.insertUser(newUser);

      if ( dbOnly !== true && id !== undefined ){
        const token = await user.getIdToken();
        newUser.token = token;
      }
      return newUser;
      
    } catch (e) {
      console.log(e);
      return { 
        error: "Insufiicient User Data"
      }
    }
  }
}
