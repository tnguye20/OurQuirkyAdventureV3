module.exports.makeCreateUser = ( {dba, auth, a} ) => {
  return async (userInfo) => {
    try{
      const { user } = await auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      const { uid, email, displayName, token } = user;
      const newUser = await dba.insertUser({
        id: uid,
        email, displayName,
        associations: [],
        createdAt: new Date().toISOString()
      });
      return {
        uid,
        email,
        id: uid,
        token
      };
    } catch (e) {
      return e;
    }
  }
}
