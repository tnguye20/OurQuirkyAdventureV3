import React, { useState } from 'react';
import { useFilterValue, useMemoriesValue } from '../../contexts';

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
import { Filter } from '../Filter';

import { memFilter } from '../../utils';

export const GridMode = () => {
  const [ currentId, setCurrentId ] = useState(null);
  const [ currentTitle, setCurrentTitle ] = useState("");
  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ titleEdit, setTitleEdit ] = useState(false);
  const { openFilter, setOpenFilter, filterCriteria, setFilterCriteria } = useFilterValue();
  const { memories } = useMemoriesValue();

  const filtered =  memFilter(memories, filterCriteria);

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

  return (
    <Container maxWidth="lg">
      <br /><br />
      <Grid container spacing={2} direction="row">
        {
          filtered.length > 0 ? filtered.map( (item, index) => {
            const { id, url, title, comments, city, state, category } = item;
            return (
              <Grid key={index} item md={6} sm={12} xs={12}>
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
                    component= { category === "image" ? "img" : category }
                    alt=""
                    src={url}
                    title=""
                    controls
                    muted
                    playsInline
                    autoPlay
                    loop
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
      <Filter open={openFilter} handleClose={ e => setOpenFilter(false) } filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria}/>
    </Container>
  )
};
