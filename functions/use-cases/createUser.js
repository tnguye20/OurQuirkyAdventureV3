module.exports.makeCreateUser = ( {dba, auth} ) => {
  return async (userInfo) => {
    try{
      const { email, password } = userInfo;
      const { user } = await auth.createUserWithEmailAndPassword(email, password)
      const { emailVerified, uid } = user;
      await dba.insertUser({
        id: uid,
        email,
        associations: [],
      });
      const token = await user.getIdToken();
      return {
        id: uid,
        uid,
        token,
        email,
        emailVerified
      };
    } catch (e) {
      return e;
    }
  }
}
