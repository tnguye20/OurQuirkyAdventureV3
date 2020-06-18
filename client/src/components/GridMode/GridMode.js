import React, { useState } from 'react';
import { useMemoriesValue } from '../../contexts';

import { db } from '../../utils/firebase';

import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

import { MemoryTitleEdit } from '../MemoryTitleEdit';

export const GridMode = () => {
  const [ currentId, setCurrentId ] = useState(null);
  const [ currentTitle, setCurrentTitle ] = useState("");
  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ titleEdit, setTitleEdit ] = useState(false);

  const openAnchorEl = (e, id, title) => {
    setCurrentId(id);
    setCurrentTitle(title);
    setAnchorEl(e.currentTarget);
  }

  const closeAnchorEl = (e) => {
    setAnchorEl(null);
  }

  const handleComments = ( comments ) => {
  }

  const removeMemory = async () => {
    if( currentId !== null ){
      try {
        db.collection("memories").doc(currentId).delete();
        setAnchorEl(null);
      } catch(e) {
        console.log(e);
      }
    }
  }

  const handleEditTitle = (e) => {
    e.preventDefault();
    console.log(currentTitle);
    db.collection("memories").doc(currentId).update( { title: currentTitle.trim() } );
    setTitleEdit(false);
  }

  const { memories } = useMemoriesValue();
  return (
    <Container maxWidth="lg">
      <br /><br />
      <Grid container spacing={2} direction="row">
        {
          memories.length > 0 ? memories.map( (item, index) => {
            const { id, url, title, comments, city, state } = item;
            return (
              <Grid item md={6} sm={12} xs={12}>
                <Card>
                  <CardHeader
                   avatar={
                     <Avatar aria-label="recipe">
                       T
                     </Avatar>
                   }
                    action={
                      <IconButton aria-label="settings" aria-controls="edit-menu" onClick={ (e) => openAnchorEl(e, id, title) }>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={ title }
                    subheader={ city === undefined || city.length === 0 ? state : `${city}, ${state}` }
                  />
                  <CardMedia
                    component="img"
                    alt=""
                    image={url}
                    title=""
                  />
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="comments" onClick={ () => handleComments(comments) }>
                      <ChatBubbleIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            )
          }) : "Loading..."
        }
      </Grid>

      <Menu
       id="edit-menu"
       anchorEl={anchorEl}
       keepMounted
       open={Boolean(anchorEl)}
       onClose={closeAnchorEl}
      >
        <MenuItem onClick={ () => setTitleEdit(true) }>Edit Memory Title</MenuItem>
        <MenuItem onClick={ removeMemory } >Remove Memory</MenuItem>
      </Menu>
      <MemoryTitleEdit title={currentTitle} setTitle={setCurrentTitle} handleEditTitle={handleEditTitle} open={titleEdit} handleClose={ () => setTitleEdit(false) } />
    </Container>
  )
};
