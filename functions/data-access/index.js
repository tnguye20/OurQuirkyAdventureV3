const { db } = require("../admin");

const dba = {};

const makeInsert = ( collection ) => {
  return async (info) => {
    try {
      let ref = db.collection(collection);
      if(info.id !== undefined){
        ref = ref.doc(info.id);
        delete info.id;
      }
      const insertedInfo = await ref.set(info);
      return insertedInfo;
    } catch (e) {
      console.log(e);
      return {}
    }
  }
}

dba.insertUser = makeInsert("users");

module.exports = {
  dba
}
