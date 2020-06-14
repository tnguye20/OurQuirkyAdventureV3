const { makeUser } = require('../models/Users');

module.exports.makeCreateUser = ( {dba, auth} ) => {
  return async (userInfo) => {
    try{
      const userModel = makeUser(userInfo);

      const email = userModel.getEmail();
      const password = userModel.getPassword();

      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      const { emailVerified, uid } = user;

      const newUser = {
        id: uid,
        email,
        emailVerified,
        displaynName: userModel.getName(),
        associations: userModel.getAssociations(),
        collections: userModel.getCollections()
      };
      await dba.insertUser(newUser);

      const token = await user.getIdToken();
      newUser.token = token;
      return newUser;
      
    } catch (e) {
      return { 
        error: "Insufiicient User Data"
      }
    }
  }
}
