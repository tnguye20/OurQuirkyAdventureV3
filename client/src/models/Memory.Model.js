export const Memory = ({
  id=null,
  user,
  title='One of my best memories with you',
  name,
  url,
  category,
  extension,
  size,
  mimetype,
  uploadDate,
  takenDate=new Date().toISOString(),
  comments=[],
  tags=[],
  isConverting
}) => {
  if(user === undefined){
    throw new Error("Invalid User");
  }
  if(url === undefined){
    throw new Error("Invalid URL");
  }
  if(size === 0 || size === "0"){
    throw new Error("Invalid file size");
  }
  isConverting = category === "video" && extension !== "mp4";

  const memory = {
    user,
    title,
    name,
    url,
    category,
    extension,
    size,
    mimetype,
    uploadDate,
    takenDate,
    comments,
    tags,
    isConverting
  };
  if (id) memory.id = id;

  return Object.freeze(memory);
}
