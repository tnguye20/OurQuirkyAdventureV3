exports.makeMemory = ({
  user,
  url,
  uploadDate,
  takenDate,
  title = "One of my best memories with you",
  comment = "",
  comments = [],
  mimetype,
  size,
  category,
  extension,
  name
}) => {
  if(title.length === 0){
    title = "One of my best memories with you";
  }
  if(comments.length === 0){
    comments = [];
  }
  if(comment.length > 0){
    comments.push(comment);
  }
  if(user === undefined){
    throw new Error("Invalid User");
  }
  if(url === undefined){
    throw new Error("Invalid URL");
  }
  if(size === 0 || size === "0"){
    throw new Error("Invalid file size");
  }
  return Object.freeze({
    user,
    url,
    uploadDate,
    takenDate,
    title,
    comments,
    mimetype,
    size,
    category,
    extension,
    name
  })
}
