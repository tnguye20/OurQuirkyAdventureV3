exports.makePostMemoryInfo = ({ dba, makeMemory }) => {
  return async ({ info }) => {
    try {
      console.log(info);
      // const { name, url, mimetype, size, createdDate, category, extension, title, comment } = info;
      await dba.insertMemory(makeMemory({ ...info }));
      return true;
    } catch(err) {
      console.log(err);
      return false;
    }
  }
}
