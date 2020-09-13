import React, { useState, useEffect } from 'react';
import { useFilterValue, useMemoriesValue, useUserValue } from '../../contexts';

import InfinityScroll from 'react-infinite-scroller';

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
  CardContent,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

import { NoSlide } from '../NoSlide';

import { MemoryTitleEdit } from '../MemoryTitleEdit';
import { Filter } from '../Filter';

import { memFilter } from '../../utils';

export const GridMode = () => {
  const { openFilter, setOpenFilter, filterCriteria, setFilterCriteria } = useFilterValue();
  const { memories } = useMemoriesValue();
  const { user } = useUserValue();

  const [ items, setItems ] = useState([]);
  const [ nextIndex, setNextIndex ] = useState(0);
  const [ hasMoreItems, setHasMoreItems ] = useState(true);
  const [ filtered, setFiltered ] = useState([]);

  useEffect(() => {
    const _filtered =  memFilter(memories, filterCriteria);
    setFiltered(_filtered);
    if(items.length > 0){
      console.log("Manual Load Items");
      if( _filtered.length === 0 ) {
        // setItems([]);
        // setHasMoreItems(false);
      } else if( _filtered.length <= 6 ){
        setItems(_filtered);
        setHasMoreItems(false);
      } else {
        setHasMoreItems(true);
        setNextIndex(6);
        setItems(_filtered.slice(0, 6));
      }
    }
  }, [memories, filterCriteria]);

  const handleComments = ( comments ) => {
  }

  const loadItems = () => {
    let _items = [];
    if(nextIndex !== -1){
      if( nextIndex + 6 < filtered.length - 1){
        _items = [...items, ...filtered.slice(nextIndex, nextIndex + 6)];
        setItems(_items);
        setNextIndex(nextIndex + 6);
      } else if (nextIndex + 6 > filtered.length - 1 && nextIndex <= filtered.length - 1) {
        _items = [...items, ...filtered.slice(nextIndex)];
        setNextIndex(-1);
        setItems(_items);
      }
    } else {
      setHasMoreItems(false);
    }
  }

  const getItems = () => (
    items.map( (item, index) => {
      const { url, title, comments, city, state, category } = item;
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
    })
  )

  return (
    <Container maxWidth="lg">
      <br /><br />
        {
          filtered.length > 0 ? (
            <InfinityScroll
              loadMore={loadItems}
              hasMore={hasMoreItems}
              loader={<LoaderSpinner key={0}/>}
            >
              <Grid container spacing={2} direction="row">
                { getItems() }
              </Grid>
            </InfinityScroll>
          ) : ( <NoSlide /> )
        }

      <Filter open={openFilter} handleClose={ e => setOpenFilter(false) } filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria}/>
    </Container>
  )
};

export const LoaderSpinner = () => (
  <div id="spinnerContainer" style={{textAlign: "center", padding: "10px"}}>
    Loading...
  </div>
)

export const LoaderCard = () => (
		<Card>
      <CardHeader
        avatar={
          <Skeleton animation="wave" variant="circle" width={40} height={40} />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
        }
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
        <Skeleton animation="wave" variant="rect" />

      <CardContent>
        <>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </>
      </CardContent>
    </Card>
)

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
    console.log()
    try {
      db.collection("memories").doc(memId).delete();
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
