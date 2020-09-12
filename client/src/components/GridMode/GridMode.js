import React, { useState } from 'react';
import { useFilterValue, useMemoriesValue, useUserValue } from '../../contexts';

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
  const { openFilter, setOpenFilter, filterCriteria, setFilterCriteria } = useFilterValue();
  const { memories } = useMemoriesValue();
  const { user } = useUserValue();

  const filtered =  memFilter(memories, filterCriteria);
  console.log("Grid Loaded");

  const handleComments = ( comments ) => {
  }

  return (
    <Container maxWidth="lg">
      <br /><br />
      <Grid container spacing={2} direction="row">
        {
          filtered.length > 0 ? filtered.map( (item, index) => {
            const { url, title, comments, city, state, category } = item;
            return (
              <Grid key={index} item md={4} sm={12} xs={12}>
                <Card>
                  <CardHeader
                   avatar={
                     <Avatar aria-label="recipe">
                       T
                     </Avatar>
                   }
                    action={
                      <GridOptions item={item} user={user} key={index}/>
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
                    playsInline
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

      <Filter open={openFilter} handleClose={ e => setOpenFilter(false) } filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria}/>
    </Container>
  )
};

export const GridOptions = ({
  item,
  user
}) => {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ open, setOpen ] = useState(false);

  const { id, collections } = user;
  const memId = item.id;

  const openAnchorEl = (e) => {
    setAnchorEl(e.currentTarget);
  }

  const closeAnchorEl = (e) => {
    setAnchorEl(null);
  }

  const removeMemory = async () => {
    try {
      db.collection("memories").doc(id).delete();
      setAnchorEl(null);
    } catch(e) {
      console.log(e);
    }
  }

  const handleEditMemory = async (e, updatedInfo) => {
    e.preventDefault();
    const newTags = updatedInfo.tags.filter( v => {
      return collections.indexOf(v) === -1;
    });
    if(newTags.length > 0){
      await db.collection("users").doc(id).update({
        collections: [
          ...collections,
          ...newTags
        ]
      });
    };
    await db.collection("memories").doc(memId).update(updatedInfo);
    setOpen(false);
    closeAnchorEl();
  }

  return (
    <>
      <IconButton aria-label="settings" aria-controls="edit-menu" onClick={ (e) => openAnchorEl(e) }>
        <MoreVertIcon />
      </IconButton>

      <Menu
       id="edit-menu"
       anchorEl={anchorEl}
       keepMounted
       open={Boolean(anchorEl)}
       onClose={closeAnchorEl}
      >
        <MenuItem onClick={ () => setOpen(true) }>Edit Memory Information</MenuItem>
        <MenuItem onClick={ removeMemory } >Remove Memory</MenuItem>
      </Menu>


      <MemoryTitleEdit item={item} handleEditMemory={handleEditMemory} open={open} handleClose={ () => setOpen(false) } />
    </>
  )
}
