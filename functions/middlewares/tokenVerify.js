exports.makeTokenVerify = ({ admin }) => {
  return async (req, res, next) => {
    try {
      if( req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ){
        let idToken = req.headers.authorization.split("Bearer ")[1];
        decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        return next();
      } else {
        res.status(403).json({ error: "Unauthorized"});
      }
    } catch(e) {
      console.log(e);
      res.status(403).json({ error: "Error while verifying token"});
    }
  }
}
