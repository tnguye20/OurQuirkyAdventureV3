exports.makeAuthUser = ({ auth }) => {
  return async (userInfo) => {
    try{
      const { email, password } = userInfo;
      const { user }  = await auth.signInWithEmailAndPassword(email, password);
      const { uid, metadata } = user;
      const token = await user.getIdToken();
      return {
        token,
        uid,
        id: uid,
        email,
        metadata
      }
    } catch(e) {
      return e;
    }
  }
}
