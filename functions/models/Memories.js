exports.makeMemory = ({
  user,
  url,
  createdDate,
  memoryTitle = "One of my best memories with you",
  memoryComments = []
}) => {
  if(user === undefined){
    throw new Error("Invalid User")
  }
  if(url === undefined){
    throw new Error("Invalid URL")
  }
  return Object.freeze({
    user,
    url,
    createdDate,
    memoryTitle,
    memoryComments
  })
}
