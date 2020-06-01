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

export const ImagePreviews = ({ info, setInfo, removeImage }) => {
  const [ open, setOpen ] = useState(false);
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
                <Grid key={index} item sm={3} xs={12}>
                  <Card>
                    <CardMedia
                      component="img"
                      alt=""
                      image={src}
                      title=""
                    />
                    <CardActions>
                      <Button size="small" color="primary" onClick={ (e) => handleOpen(filename) }>
                        { info[filename].title === "" || info[filename].comment === "" ? "Add" : "Edit" } Details
                      </Button>
                      <Button size="small" color="secondary" onClick={ e => removeImage(index) }>
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })
          }
        </Grid>
      </Container>

      <MemoryDetails handleAddDetails={handleAddDetails} title={title} setTitle={setTitle} comment={comment} setComment={setComment} open={open} handleClose={handleClose} currentFileName={currentFileName} />

    </>
  )
}
