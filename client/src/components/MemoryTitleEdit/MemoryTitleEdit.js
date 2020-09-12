import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  Chip
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useUserValue } from '../../contexts';

const nullReplace = (value, d="") => {
  if ( Array.isArray(value) ) return value.length > 0 ? value : [];
  return value === undefined || value === null ? d : value;
}

export const MemoryTitleEdit = ({
  open,
  handleClose,
  item,
  handleEditMemory
}) => {
  const [ title, setTitle ] = useState(nullReplace(item.title));
  const [ tags, setTags ] = useState(nullReplace(item.tags));
  const [ city, setCity ] = useState(nullReplace(item.city));
  const [ state, setState ] = useState(nullReplace(item.state));
  const [ country, setCountry ] = useState(nullReplace(item.country));
  const [ zipcode, setZipcode ] = useState(nullReplace(item.zipcode));
  const [ takenDate, setTakenDate ] = useState(nullReplace(item.takenDate));
  const resetInputs = useState(0)[1];

  const { user } = useUserValue();
  const { collections } = user;

  const getUpdatedInfo = () =>  ({
    title,
    tags,
    city,
    state,
    country,
    zipcode,
    takenDate
  })

  return(
    <Dialog open={open} onClose={ () => { resetInputs(1); handleClose(); } } aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Memory Title</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Feel free to be as descriptive as possible.
        </DialogContentText>
        <TextField
          autoFocus
          onFocus={e => e.target.select()}
          onChange={e => setTitle(e.target.value)}
          margin="dense"
          id="title"
          label="Title"
          fullWidth
          value={title}
        />
        <TextField
          onChange={e => setCity(e.target.value)}
          margin="dense"
          id="city"
          label="City"
          fullWidth
          value={city}
        />
        <TextField
          onChange={e => setState(e.target.value)}
          margin="dense"
          id="state"
          label="State"
          fullWidth
          value={state}
        />
        <TextField
          onChange={e => setCountry(e.target.value)}
          margin="dense"
          id="country"
          label="Country"
          fullWidth
          value={country}
        />
        <TextField
          onChange={e => setZipcode(e.target.value)}
          margin="dense"
          id="zipcode"
          label="Zip Code"
          fullWidth
          value={zipcode}
        />
        <TextField
          onChange={e => setTakenDate(e.target.value)}
          margin="dense"
          id="takenDate"
          label="Taken Date"
          fullWidth
          value={takenDate}
        />
        <br />
        <Autocomplete
            multiple
            freeSolo
            value={tags}
            onChange={ (e, newValue) => {
                console.log(newValue);
                setTags([...newValue]);
            }}
            id="tags"
            options={collections.map( item => item )}
            style={{ width: "100%" }}
            renderTags={
                (value, getTagProps) =>
                    value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} />
                ))
            }
            renderInput={(params) => <TextField {...params} label="Tags"/>}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined" size="small">
          Cancel
        </Button>
        <Button onClick={ (e) => {handleEditMemory(e, getUpdatedInfo())} } color="primary" variant="outlined" size="small">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
