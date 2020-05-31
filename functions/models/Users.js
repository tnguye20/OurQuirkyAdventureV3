exports.makeUser = ({
  id,
  displayName,
  email,
  emailVerified = false,
  associations = [],
  password = undefined
}) => {
  if (id === undefined || displayName === undefined || email === undefined){
    throw new Error("Insufiicient User data");
  }

  return Object.freeze({
    getID: () => id,
    getName: () => displayName,
    getEmail: () => email,
    getPassword: () => password,
    isVerified: () => emailVerified,
    getAssociations: () => associations
  })
}
