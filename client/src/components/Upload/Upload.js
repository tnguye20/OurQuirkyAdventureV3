import React, { useState } from 'react';
import { storage, db } from '../../utils/firebase';
import { ImagePreviews } from '../ImagePreviews';
import { useAuthValue } from '../../contexts';
import { FILE_FORMATS } from '../../constants/files';
import { getImageSource } from '../../utils';
import { useHistory } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import './Upload.css';

import {
  Container,
  Grid,
  Button,
  LinearProgress,
  makeStyles
} from '@material-ui/core';

// import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  button: {
      margin: theme.spacing(1),
    },
  progress: {
    width: "100%"
  }
}));

export const Upload = () => {
  const classes = useStyles();

  const history = useHistory();
  const { authUser } = useAuthValue();
  // const { uid, tokenId } = authUser;
  const { uid } = authUser;
  const [ files, setFiles ] = useState([]);
  const [ info, setInfo ] = useState({});
  const [ isUploading, setIsUploading ] = useState(false);

  const removeImage = (index) => {
    const tmpFiles = [...files];
    const tmpInfo = {...info};
    const filename = tmpFiles[index].name;
    tmpFiles.splice(index, 1);
    delete tmpInfo[filename];
    setFiles(tmpFiles);
    setInfo(tmpInfo);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const uploadPromises = [];
      const now = Date.now();
      for(const file of files){
        const { name, type, size } = file;
        const mimetype = type;
        const [ category, extension ] = mimetype.split("/");
        const nameOnly = name.split(".")[0];
        const newName = `${nameOnly}_${now}.${extension}`;
        const fullPath = `${uid}/${category}/${newName}`;
        const promise = storage.child(fullPath).put(file).then( async snapshot => {
          const url = await snapshot.ref.getDownloadURL();
          const metadata = await snapshot.ref.getMetadata();
          const { timeCreated } = metadata;
          const { title, comment } = info[name];
          info[name] = {user: uid, title, comment, url, category, extension, size, mimetype, createdDate: timeCreated, name: newName};
          if (comment.length > 0) {
            info[name].comments = [ comment ];
          }
          if (title.length === 0 ){
            info[name].title = "One of my best memories with you";
          }
          db.collection("memories").add(info[name]);
          // const formData = new FormData();
          // formData.append("info", JSON.stringify(info[name]));
          // await axios.post("/memory/info", formData , {
          //   headers: { "Authorization": "Bearer " + tokenId }
          // });
        })
        uploadPromises.push(promise);
      }
      if(uploadPromises.length > 0){
        await Promise.all(uploadPromises);
        history.push("/");
      } else {
        setIsUploading(false);
      }
    } catch (err){
      setIsUploading(false);
      console.log(err);
    }
  }

  const handleFilesChange = async (e) => {
    setInfo({});
    setFiles([]);
    setIsUploading(true);
    const files = e.target.files;
    try{
      if (files.length > 0){
        let imageSrcsArr = [];
        let newInfo = {};
        for (const file of files){
          const { type, name } = file;
          if(FILE_FORMATS.indexOf(type) !== -1){
            newInfo[name] = {
              src: "",
              title: "",
              comment: ""
            };
            imageSrcsArr.push( getImageSource(file) );
          }
        }
        imageSrcsArr = await Promise.all(imageSrcsArr);
        const infoKeys = Object.keys(newInfo);
        imageSrcsArr.forEach( ( src, index ) => {
          newInfo[infoKeys[index]].src = src;
        } );
        setFiles(files);
        setInfo(newInfo);
        setIsUploading(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Container maxWidth="md">
        <br /><br />
        <h2>Upload Memory</h2>
        <Grid container spacing={2} direction="row">
            {
              isUploading ? (
                <>
                  <LinearProgress className={classes.progress}/>
                </>
              ) : (
                <form onSubmit={handleSubmit} encType="multipart/form-data" id="uploadForm">
                  <input id="fileUpload" type="file" name="memories[]" multiple onChange={handleFilesChange}/>
                  <label htmlFor="fileUpload">
                    <Button disabled={isUploading} className={classes.button} variant="contained" color="primary" component="span" size="medium" startIcon={<CloudUploadIcon />}>
                      Select Memories
                    </Button>
                  </label>
                  <Button disabled={isUploading} className={classes.button} type="submit" variant="contained" color="secondary" size="medium" startIcon={<SaveIcon />}>
                    Upload
                  </Button>
                </form>
              )
            }
        </Grid>
      </Container>
      <br />
      <br />
      {
        Object.values(info).length > 0 ? ( <ImagePreviews isUploading={isUploading} info={info} setInfo={setInfo} removeImage={removeImage} /> ) : ""
      }
    </>
  )
}