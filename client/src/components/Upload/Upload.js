import React, { useState } from 'react';
import { storage, db } from '../../utils/firebase';
import { ImagePreviews } from '../ImagePreviews';
import { useAuthValue, useUserValue } from '../../contexts';
import { FILE_FORMATS } from '../../constants/files';
import { getImageSource } from '../../utils';
import { useHistory } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import './Upload.css';

import { SelectionModal } from '../SelectionModal';

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
  const { uid } = authUser;
  // const { uid, tokenId } = authUser;
  const { user } = useUserValue();
  const { collections } = user;
  const [ files, setFiles ] = useState([]);
  const [ info, setInfo ] = useState({});
  const [ isUploading, setIsUploading ] = useState(false);
  const [ isSelecting, setIsSelecting ] = useState(false);
  const [ selection, setSelection ] = useState({});
  const [ openSelectionModal, setOpenSelectionModal ] = useState(false);

  const removeImage = (index) => {
    const tmpSelection = {...selection};
    const tmpFiles = [...files];
    const tmpInfo = {...info};
    const filename = tmpFiles[index].name;
    tmpFiles.splice(index, 1);
    delete tmpInfo[filename];
    delete tmpSelection[filename];
    setFiles(tmpFiles);
    setInfo(tmpInfo);
    setSelection(tmpSelection);
  }

  const handleSelectClick = ( name ) => {
    const tmpSelection = {...selection};
    tmpSelection[name].select = !tmpSelection[name].select;
    setSelection(tmpSelection);
    const selecting = Object.values(tmpSelection).reduce( (result, value) => {
      const { select } = value;
      return result || select;
    }, false);
    setIsSelecting(selecting);
  }

  const resetSelection = () => {
    let tmpSelection = {...selection};
    Object.keys(tmpSelection).forEach( key => {
      tmpSelection[key].select = false;
    });
    setIsSelecting(false);
    setSelection(tmpSelection);
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
          const { title, comment, tags } = info[name];
          info[name] = {
            user: uid,
            title,
            url,
            category,
            extension,
            size,
            mimetype,
            uploadDate: timeCreated,
            name: newName,
            takenDate: new Date().toISOString(),
            comments: [],
            tags
          };
          if (title.length === 0 ){
            info[name].title = "One of my best memories with you";
          }
          db.collection("memories").add(info[name]).then( ref => {
            if (comment.length > 0) {
              info[name].comment = {
                memoryID: ref.id,
                user: uid,
                createDate: timeCreated,
                text: comment,
                replyToId: null,
                modifiedOn: timeCreated
              }
              db.collection("memories").doc(ref.id).update({comments: [ info[name].comment ]})
            } else {
              info[name].comments = [];
            }
          })
          // const formData = new FormData();
          // formData.append("info", JSON.stringify(info[name]));
          // await axios.post("api/memory/info", formData , {
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
    setSelection({});
    setFiles([]);
    setIsUploading(true);
    const files = e.target.files;
    try{
      if (files.length > 0){
        let imageSrcsArr = [];
        let newInfo = {};
        let newSelection = {};
        for (const file of files){
          const { type, name } = file;
          if(FILE_FORMATS.indexOf(type) !== -1){
            newInfo[name] = {
              src: "",
              title: "",
              comment: "",
              tags: []
            };
            newSelection[name] = {
              select: false
            }
            imageSrcsArr.push( getImageSource(file) );
          }
        }
        setSelection(newSelection);
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
                  {
                    isSelecting ? (
                      <>
                        <Button disabled={isUploading && isSelecting} className={classes.button} variant="contained" color="primary" size="medium" startIcon={<AddIcon />} onClick={ () => { setOpenSelectionModal(true) }}>
                          Tag
                        </Button>
                        <Button disabled={isUploading && isSelecting} className={classes.button} variant="contained" color="secondary" size="medium" startIcon={<RemoveIcon />} onClick={ () => { resetSelection() }}>
                          Reset
                        </Button>
                      </>
                    ) : ""
                  }
                </form>
              )
            }
        </Grid>

        <SelectionModal uid={uid} isUploading={isUploading} selection={selection} resetSelection={resetSelection} collections={collections} info={info} setInfo={setInfo} open={openSelectionModal} handleClose={ () => { setOpenSelectionModal(false) } }/>

      </Container>
      <br />
      <br />
      {
        Object.values(info).length > 0 ? ( <ImagePreviews isUploading={isUploading} info={info} setInfo={setInfo} removeImage={removeImage} selection={selection} handleSelectClick={handleSelectClick} /> ) : ""
      }
    </>
  )
}
