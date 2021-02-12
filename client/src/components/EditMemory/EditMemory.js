import React, { useState } from 'react'
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Button
} from '@material-ui/core';
import { Filter } from '../Filter';
import { memFilter } from '../../utils';

import { useMemoriesValue, useFilterValue } from '../../contexts/';
import { BulkMemoryEdit } from '../BulkMemoryEdit';

import './EditMemory.css';

import { MemoriesDAO } from '../../data-access';

export const EditMemory = () => {

  const { memories } = useMemoriesValue();
  const { openFilter, setOpenFilter, filterCriteria, setFilterCriteria } = useFilterValue();
  const [ selection, setSelection ] = useState({});
  const [ open, setOpen ] = useState(false);
  let tmpSelection = {};

  const filtered =  memFilter(memories, filterCriteria);

  const handleClick = (e, item) => {
    e.preventDefault();
    e.target.classList.toggle("selected");
    const _selection = {...tmpSelection};
    if (_selection[item.id] === undefined){
      _selection[item.id] = item;
    } else {
      delete _selection[item.id];
    }
    tmpSelection = _selection;
    console.log(tmpSelection);
    // setSelection(_selection);
  }

  const handleClose = () => {
    setOpen(false);
    Array.from( document.querySelectorAll(".selected") ).forEach( node => {
      node.classList.remove("selected");
    });
  }

  const handleEdit = (e) => {
    e.preventDefault();
    setSelection(tmpSelection);
    if(Object.keys(tmpSelection).length > 0){
      setOpen(true);
    }
  }

  const handleDelete = async (e, ids, data) => {
    try {
      const m = ids.map((id) => MemoriesDAO.deleteByID(id));
      await Promise.all(m);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      handleClose();
    }
  }

  const handleEditMemory = async (e, ids, data) => {
    console.log(data);
    try {
      const m = ids.map((id) => MemoriesDAO.updateByID({
        id,
        data
      }));
      await Promise.all(m);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      handleClose();
    }
  }

  return (
    <>
      <br /><br />
      <Container maxWidth="lg">
        <h1>
          Bulk Edit Memory
          <Button color="primary" onClick={handleEdit} > Bulk Edit </Button>
        </h1>
        <Grid container spacing={2} direction="row" >
          {
            filtered.length > 0 ? filtered.map( (item, index) => {
              const { url, category } = item;
              return (
                <Grid key={index} item md={2} sm={12} xs={12} className="previewContainer"
                  onClick={ e => { handleClick(e, item); } }
                >
                  <Card>
                    <CardMedia
                      component= { category === "image" ? "img" : category }
                      alt=""
                      src={url}
                      title=""
                      playsInline
                      autoPlay
                      muted
                      loop
                    />
                  </Card>
                </Grid>
              )
            }) : ""
          }
        </Grid>
      </Container>

      <BulkMemoryEdit item={selection} open={open} handleEditMemory={handleEditMemory} handleClose={handleClose} handleDelete={handleDelete}/>

      <Filter open={openFilter} handleClose={ e => setOpenFilter(false) } filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria}/>
    </>
  )
}
