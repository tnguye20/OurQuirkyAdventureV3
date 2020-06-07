const { db } = require('../admin');

exports.removeMemoryFile = async ( object ) => {
  try {
    const filePath = object.name;
    const [ user, category, filename ] = filePath.split("/");
    const snapshot = await db.collection("memories").where("user", "==", user).where("name", "==", filename).get();
    if(!snapshot.empty){
      snapshot.forEach( memory => {
        console.log(`Deleting ${memory.id} - ${filename} from memories`);
        db.collection("memories").doc(memory.id).delete();
      })
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
