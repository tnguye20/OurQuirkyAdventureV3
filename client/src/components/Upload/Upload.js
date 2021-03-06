import React, { useState } from 'react';
import { storage, db } from '../../utils/firebase';
import { ImagePreviews } from '../ImagePreviews';
import { useAuthValue, useUserValue } from '../../contexts';
import { useAlert } from '../../hooks/useAlert';
import { FILE_FORMATS } from '../../constants/files';
import { getImageSource, getVideoSource, bytesToMegabytes } from '../../utils';
import { useHistory } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';
import LabelIcon from '@material-ui/icons/Label';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Alert from '@material-ui/lab/Alert';

import * as ALERT_TYPES from '../../constants/alerts';

import './Upload.css';

import { SelectionModal } from '../SelectionModal';

import {
  Container,
  Grid,
  Button,
  LinearProgress,
  makeStyles,
  Collapse
} from '@material-ui/core';

// import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  button: {
      margin: theme.spacing(1),
  },
  hidden: {
    display: "none"
  },
  progress: {
    width: "100%"
  },
  speedDial: {
    position: 'fixed',
    '&button': {
      backgroundColor: "teal"
    },
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
          bottom: theme.spacing(2),
          right: theme.spacing(2),
        },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
          top: theme.spacing(2),
          left: theme.spacing(2),
        },
  },
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
  const [ openDial, setOpenDial ] = useState(false);
  const { alertOpen, alertType, alertMsg, setAlertOpen, setAlertMsg, setAlertType } = useAlert();

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
            tags,
            isConverting: category === "video" && extension !== "mp4" ? true : false
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
                modifiedOn: timeCreated,
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
        history.push("/slide");
      } else {
        setIsUploading(false);
      }
    } catch (err){
      setAlertMsg();
      setAlertType(ALERT_TYPES.ALERT_SUCCESS_MSG + " " + err.message);
      setAlertOpen(true);
      setInfo({});
      setSelection({});
      setFiles([]);
      setIsUploading(false);
      console.log(err);
    }
  }

  const handleFilesChange = async (e) => {
    setInfo({});
    setSelection({});
    setFiles([]);
    setIsUploading(true);
    setAlertOpen(false);
    let _files = e.target.files;
    try{
      if (_files.length > 0){
        let mediaSrcsArr = [];
        let newInfo = {};
        let newSelection = {};
        const badFiles = [];
        for (const file of _files){
          const { type, name, size } = file;
          const category = type.split("/")[0];
          if(FILE_FORMATS.indexOf(type) !== -1 && bytesToMegabytes(size) <= 30 ){
            newInfo[name] = {
              category: category === "image" ? "img" : category,
              type,
              src: "",
              title: "",
              comment: "",
              tags: []
            };
            newSelection[name] = {
              select: false
            }
            if ( category === "image" ){
              mediaSrcsArr.push( getImageSource(file) );
            } else if (  category === "video" ) {
              mediaSrcsArr.push( getVideoSource(file) );
            }
          } else {
            badFiles.push(name);
          }
        }

        if( badFiles.length > 0 ) {
          e.target.files = null;
          setAlertMsg(`${badFiles.join(", ")} violated file type or size restriction. Please choose again.`);
          setAlertType(ALERT_TYPES.ALERT_ERROR);
          setAlertOpen(true);
          setInfo({});
          setSelection({});
          setFiles([]);
          setIsUploading(false);
          return false;
        }

        setSelection(newSelection);
        mediaSrcsArr = await Promise.all(mediaSrcsArr);
        const infoKeys = Object.keys(newInfo);
        mediaSrcsArr.forEach( ( src, index ) => {
          newInfo[infoKeys[index]].src = src;
        } );
        setFiles(_files);
        setInfo(newInfo);
        setIsUploading(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const clickSelect = () => {
    const selectBtn = document.querySelector("#selectBtn");
    if ( selectBtn !== null ) selectBtn.click();
    setOpenDial(false);
  }

  const clickUpload = () => {
    const uploadBtn = document.querySelector("#uploadBtn");
    if ( uploadBtn !== null ) uploadBtn.click();
    setOpenDial(false);
  }

  return (
    <>
      <Container maxWidth="md">
        <br /><br />
        <h2>Upload Memory</h2>
        <br />
        <Collapse in={alertOpen}>
          <Alert
            severity={alertType}
            onClose={() => setAlertOpen(false)}
          >
            { alertMsg }
          </Alert>
          <br />
        </Collapse>

        <br />
        <h3>Allowed formats and restriction</h3>
        <p> <b>Video</b>: { FILE_FORMATS.filter( format => format.indexOf("video") !== -1 ).map( format => format.replace("video/", "") ).join(", ") } (non-mp4 files will be converted to mp4 for viewing purposes)</p>
        <p> <b>Image</b>: { FILE_FORMATS.filter( format => format.indexOf("image") !== -1 ).map( format => format.replace("image/", "") ).join(", ") } </p>
        <p><i>Limit to 20MB per file. Please upgrade to upload more.</i></p>

        <br />
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
                    <Button id="selectBtn" disabled={isUploading} className={classes.button, classes.hidden} variant="contained" color="primary" component="span" size="medium" startIcon={<CloudUploadIcon />}>
                      Select Memories
                    </Button>
                  </label>
                  <Button id="uploadBtn" disabled={isUploading} className={classes.button, classes.hidden} type="submit" variant="contained" color="secondary" size="medium" startIcon={<SaveIcon />}>
                    Upload
                  </Button>
                </form>
              )
            }
        </Grid>

        <SelectionModal isUploading={isUploading} selection={selection} resetSelection={resetSelection} collections={collections} info={info} setInfo={setInfo} open={openSelectionModal} handleClose={ () => { setOpenDial(false); setOpenSelectionModal(false); } }/>

      </Container>
      <br />
      <br />
      {
        Object.values(info).length > 0 ? ( <ImagePreviews resetSelection={resetSelection} collections={collections} isUploading={isUploading} info={info} setInfo={setInfo} removeImage={removeImage} selection={selection} handleSelectClick={handleSelectClick} /> ) : ""
      }

      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        hidden={false}
        icon={<SpeedDialIcon />}
        onClose={() => setOpenDial(false)}
        onOpen={() => setOpenDial(true)}
        open={openDial}
        direction={"up"}
      >
        <SpeedDialAction
          icon={<PhotoSizeSelectActualIcon />}
          tooltipTitle={"Select Memories"}
          tooltipOpen
          onClick={ clickSelect }
        />
        {
          isSelecting ? (
            <SpeedDialAction
              icon={<LabelIcon />}
              tooltipTitle={"Tag"}
              tooltipOpen
              onClick={ () => { setOpenSelectionModal(true); setOpenDial(false); } }
            />
          ) : ""
        }
        {
          isSelecting ? (
            <SpeedDialAction
              icon={<RemoveIcon />}
              tooltipTitle={"Remove Selection"}
              tooltipOpen
              onClick={ resetSelection }
            />
          ) : ""
        }
        {
          files.length > 0 ? (
            <SpeedDialAction
              icon={<CloudUploadIcon />}
              tooltipTitle={"Upload"}
              tooltipOpen
              onClick={ clickUpload }
            />
          ) : ""
        }
      </SpeedDial>
    </>
  )
}
