import React, { useState } from 'react';
import { MemoryDetails } from '../MemoryDetails';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Button
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import './ImagePreviews.css';

import { SelectionModal } from '../SelectionModal';

export const ImagePreviews = ({ resetSelection, collections, isUploading, info, selection, setInfo, removeImage, handleSelectClick }) => {
  const [ open, setOpen ] = useState(false);

  const [ openSelectionModal, setOpenSelectionModal ] = useState(false);
  const [ selectedFile, setSelectedFile ] = useState("");
  const [ currentFileName, setCurrentFileName ] = useState("");
  const [ title, setTitle ] = useState("");
  const [ comment, setComment ] = useState("");

  const handleOpen = (filename) => {
    setCurrentFileName(filename);
    setTitle(info[filename].title);
    setComment(info[filename].comment);
    setOpen(true);
  };

  const handleClose = () => {
    setTitle("");
    setComment("");
    setOpen(false);
  };

  const handleAddDetails = (e) => {
    e.preventDefault();
    const tmpInfo = {...info};
    tmpInfo[currentFileName].title = title.trim();
    tmpInfo[currentFileName].comment = comment.trim();
    setInfo(tmpInfo);
    setTitle("");
    setComment("");
    handleClose();
  }

  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={2} direction="row">
          {
            Object.entries(info).map( (item, index) => {
              const [filename, values] = item;
              const { src } = values;
              return (
                <Grid key={index} item md={3} sm={12} xs={12} className={
                  selection[filename].select === true ? "previewContainer selected" : "previewContainer"
                }>
                  <Card>
                    <CardMedia
                      component="img"
                      alt=""
                      image={src}
                      title=""
                      onClick={ () => { if (!isUploading && info[filename].tags.length === 0) handleSelectClick(filename) } }
                    />
                    <CardActions>
                      <Button disabled={isUploading} size="small" color="primary" onClick={ (e) => handleOpen(filename) }>
                        { info[filename].title === "" && info[filename].comment === "" ? "Add" : "Edit" } Details
                      </Button>
                      <Button disabled={isUploading} size="small" color="secondary" onClick={ e => removeImage(index) }>
                        Delete
                      </Button>
                      {
                        selection[filename].select === true ? (
                          <CheckIcon className="selectIcon"/>
                        ) : ""
                      }
                      {
                        info[filename].tags.length > 0 ? (
                          <LoyaltyIcon className="tagIcon" onClick={ () => {setSelectedFile(filename); setOpenSelectionModal(true)} }/>
                        ) : ""
                      }
                    </CardActions>
                  </Card>
                </Grid>
              )
            })
          }
        </Grid>
      </Container>

      <SelectionModal isSingular={true} selectedFile={selectedFile} isUploading={isUploading} selection={selection} resetSelection={resetSelection} collections={collections} info={info} setInfo={setInfo} open={openSelectionModal} handleClose={ () => { setOpenSelectionModal(false); } }/>
      <MemoryDetails handleAddDetails={handleAddDetails} title={title} setTitle={setTitle} comment={comment} setComment={setComment} open={open} handleClose={handleClose} currentFileName={currentFileName} />

    </>
  )
}
