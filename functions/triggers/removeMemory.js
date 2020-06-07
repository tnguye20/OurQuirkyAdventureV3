const { storage } = require('../admin');

exports.removeMemory = async ( snap, context ) => {
  try {
    const memoryID = context.params.id;
    const deleteValue = snap.data();
    const { user, category, name } = deleteValue;
    const fullPath = `${user}/${category}/${name}`;
    console.log(`Deleting ${fullPath}`);
    await storage.file(fullPath).delete();
    return true;
  } catch( e ) {
    console.log(e);
    return false;
  }
}
