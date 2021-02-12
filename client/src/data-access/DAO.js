export const DAO = ({
  db,
  collection
}) => {
  const dao = db.collection(collection);

  const insert = async ({
    model,
    id=undefined
  }) => (
    id
    ? dao.doc(id).set(model)
    : dao.add(model)
  );

  const getByID = async (id) => {
    const doc = await dao.doc(id).get();
    if ( doc.exists ) {
      return doc.data();
    }
    return null;
  }

  const deleteByID = async (id) => (
    dao.doc(id).delete()
  );

  const updateByID = async ({
    id,
    data
  }) => (
    dao.doc(id).update(data)
  )

  return Object.freeze({
    dao,
    insert,
    getByID,
    deleteByID,
    updateByID
  });
}
