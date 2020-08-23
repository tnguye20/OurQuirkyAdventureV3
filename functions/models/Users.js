exports.makeUser = ({
  id = "",
  displayName = "",
  email = "",
  emailVerified = false,
  associations = [],
  password = "",
  collections = [],
  token = null
}) => {
  if (displayName === "" || email === "" || password === ""){
    throw new Error("Insufiicient User data");
  }

  const addCollection = ( collection ) => (
    collections.push(collection)
  );

  const setID = (_id) => ( id = _id );
  const setIsVerified = (_isVerified) => ( isVerified = _isVerified );
  const setEmail = (_email) => ( email = _email );
  const setToken = (_token) => ( token = _token );

  const getData = () => (
    {
      id,
      email,
      emailVerified,
      displaynName,
      associations,
      collections,
      token
    }
  )

  return Object.freeze({
    getID: () => id,
    getName: () => displayName,
    getEmail: () => email,
    getPassword: () => password,
    isVerified: () => emailVerified,
    getAssociations: () => associations,
    getCollections: () => collections,
    setID,
    setIsVerified,
    setEmail,
    getData,
    setToken,
    addCollection,
  })
}
