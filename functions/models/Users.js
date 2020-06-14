exports.makeUser = ({
  id = "",
  displayName = "",
  email = "",
  emailVerified = false,
  associations = [],
  password = "",
  collections = []
}) => {
  if (displayName === "" || email === "" || password === ""){
    throw new Error("Insufiicient User data");
  }

  const addCollection = ( collection ) => (
    collections.push(collection)
  );

  return Object.freeze({
    getID: () => id,
    getName: () => displayName,
    getEmail: () => email,
    getPassword: () => password,
    isVerified: () => emailVerified,
    getAssociations: () => associations,
    getCollections: () => collections,
    addCollection,
  })
}
